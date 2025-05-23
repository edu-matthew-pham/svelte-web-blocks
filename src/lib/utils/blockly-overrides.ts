import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import { safeProcedureGeneration } from './procedure-generators.js';
import { registerHighLevelGenerators } from './jsHighLevelGenerator.js';
import { overrideMathGenerators } from './math-generators.js';
import { overrideTextGenerators } from './text-generators.js';
import { overrideListGenerators } from './list-generators.js';

// ======== Variable Tracking ========
export const VariableTracker = {
  declaredIds: new Set<string>(),
  
  isDeclared(id: string): boolean {
    return this.declaredIds.has(id);
  },
  
  markAsDeclared(id: string): void {
    this.declaredIds.add(id);
  },
  
  reset(): void {
    this.declaredIds.clear();
  }
};

// Track initialization state
let initialized = false;

// Create a flag to prevent recursive calls
let inProcedureGeneration = false;

// ======== Web Component Extensions ========
function initWebComponentExtensions() {
  // Only register extensions if they don't already exist
  if (!Blockly.Extensions.isRegistered('web_content_compatible')) {
    // Register an extension that makes blocks compatible with web content blocks
    Blockly.Extensions.register('web_content_compatible', function() {
      this.setPreviousStatement(true, "web_component");
      this.setNextStatement(true, "web_component");
    });
  }

  if (!Blockly.Extensions.isRegistered('web_content_compatible_with_return')) {
    // Register an extension for procedure_defreturn blocks
    Blockly.Extensions.register('web_content_compatible_with_return', function() {
      this.setOutput(false);
      this.setPreviousStatement(true, "web_component");
      this.setNextStatement(true, "web_component");
    });
  }
}

// ======== Procedure Block Extensions ========
function applyWebCompatibilityToProcedureBlocks() {
  // Get original init functions
  const defNoReturnInit = Blockly.Blocks['procedures_defnoreturn'].init;
  const defReturnInit = Blockly.Blocks['procedures_defreturn'].init;
  const callNoReturnInit = Blockly.Blocks['procedures_callnoreturn'].init;
  const callReturnInit = Blockly.Blocks['procedures_callreturn'].init;

  // Override procedure block init functions
  Blockly.Blocks['procedures_defnoreturn'].init = function() {
    defNoReturnInit.call(this);
    Blockly.Extensions.apply('web_content_compatible', this, false);
  };

  Blockly.Blocks['procedures_defreturn'].init = function() {
    defReturnInit.call(this);
    Blockly.Extensions.apply('web_content_compatible_with_return', this, false);
  };

  Blockly.Blocks['procedures_callnoreturn'].init = function() {
    callNoReturnInit.call(this);
    Blockly.Extensions.apply('web_content_compatible', this, false);
  };

  Blockly.Blocks['procedures_callreturn'].init = function() {
    callReturnInit.call(this);
    // Keep output connection but could set specific types if needed
  };
}

// ======== Procedure Code Generators ========
function overrideProcedureGenerators() {
  // Store original generators
  const originalDefNoReturnGenerator = javascriptGenerator.forBlock['procedures_defnoreturn'];
  const originalDefReturnGenerator = javascriptGenerator.forBlock['procedures_defreturn'];
  const originalCallNoReturnGenerator = javascriptGenerator.forBlock['procedures_callnoreturn'];
  const originalCallReturnGenerator = javascriptGenerator.forBlock['procedures_callreturn'];

  // Override with web-component versions with error handling
  javascriptGenerator.forBlock['procedures_defnoreturn'] = function(block: Blockly.Block): string | [string, number] | null {
    return safeProcedureGeneration(block, originalDefNoReturnGenerator, false);
  };
  
  // Override procedures_defreturn similarly
  javascriptGenerator.forBlock['procedures_defreturn'] = function(block: Blockly.Block): string | [string, number] | null {
    return safeProcedureGeneration(block, originalDefReturnGenerator, true);
  };
  
  // Improve the procedures_callnoreturn generator as well
  javascriptGenerator.forBlock['procedures_callnoreturn'] = function(block) {
    try {
      if (!block) {
        console.warn('Invalid procedure call block encountered');
        return '// Invalid procedure call\n';
      }
      
      // Try to extract the procedure name directly if possible
      let procName = 'unnamed_procedure';
      try {
        if (block.getFieldValue) {
          const nameFromField = block.getFieldValue('NAME');
          if (nameFromField) procName = nameFromField;
        }
      } catch (e) {
        console.warn('Could not extract procedure name from call block');
      }
      
      // Call the original generator, but be prepared for failure
      let code;
      try {
        code = originalCallNoReturnGenerator.call(this, block);
      } catch (e) {
        console.warn('Original generator failed, using fallback', e);
        code = `${procName}(); // Fallback call`;
      }
      
      return `${code}\n`;
    } catch (e) {
      console.error('Error in procedures_callnoreturn generator:', e);
      return '// Error generating procedure call code\n';
    }
  };
}

// ======== Variable Block Overrides ========
function overrideVariableGenerators() {
  // Override variables_set generator
  javascriptGenerator.forBlock['variables_set'] = function(block: Blockly.Block) {
    const variableId = block.getFieldValue('VAR');
    const variableName = javascriptGenerator.nameDB_!.getName(
      variableId,
      Blockly.Names.NameType.VARIABLE
    );
    
    const value = javascriptGenerator.valueToCode(
      block, 'VALUE', (javascriptGenerator as any).ORDER_ASSIGNMENT
    ) || '0';
    
    if (VariableTracker.isDeclared(variableId)) {
      return `${variableName} = ${value};\n`;
    } else {
      VariableTracker.markAsDeclared(variableId);
      return `var ${variableName} = ${value};\n`;
    }
  };
  
  // Similarly override variables_get if needed
  javascriptGenerator.forBlock['variables_get'] = function(block: Blockly.Block) {
    const variableId = block.getFieldValue('VAR');
    const variableName = javascriptGenerator.nameDB_!.getName(
      variableId,
      Blockly.Names.NameType.VARIABLE
    );
    return [variableName, (javascriptGenerator as any).ORDER_ATOMIC];
  };
  
  // Reset tracker when starting generation
  const originalInit = javascriptGenerator.init;
  javascriptGenerator.init = function(ws: Blockly.Workspace) {
    originalInit.call(this, ws);
    (this as any).definitions_ = Object.create(null);
    (this as any).functionNames_ = Object.create(null);
    VariableTracker.reset();
  };
}

// ======== Function Block Overrides ========
function overrideFunctionGenerators() {
  // Function definition without return value
  if (javascriptGenerator.forBlock['procedures_defnoreturn']) {
    javascriptGenerator.forBlock['procedures_defnoreturn'].highLevel = function(block: Blockly.Block) {
      const funcName = javascriptGenerator.nameDB_!.getName(
        block.getFieldValue('NAME'),
        Blockly.Names.NameType.PROCEDURE
      );
      
      // Get arguments
      const args: string[] = [];
      for (let i = 0; i < (block as any).arguments_.length; i++) {
        args.push(javascriptGenerator.nameDB_!.getName(
          (block as any).arguments_[i],
          Blockly.Names.NameType.VARIABLE
        ));
      }
      
      // Get function body statements
      const statements: any[] = [];
      let bodyBlock = block.getInputTargetBlock('STACK');
      while (bodyBlock) {
        const statement = javascriptGenerator.blockToHighLevel(bodyBlock);
        if (statement) statements.push(statement);
        bodyBlock = bodyBlock.getNextBlock();
      }
      
      return {
        type: 'function_definition',
        name: funcName,
        arguments: args,
        hasReturn: false,
        body: statements
      };
    };
  }
  
  // Function definition with return value
  if (javascriptGenerator.forBlock['procedures_defreturn']) {
    javascriptGenerator.forBlock['procedures_defreturn'].highLevel = function(block: Blockly.Block) {
      const funcName = javascriptGenerator.nameDB_!.getName(
        block.getFieldValue('NAME'),
        Blockly.Names.NameType.PROCEDURE
      );
      
      // Get arguments
      const args: string[] = [];
      for (let i = 0; i < (block as any).arguments_.length; i++) {
        args.push(javascriptGenerator.nameDB_!.getName(
          (block as any).arguments_[i],
          Blockly.Names.NameType.VARIABLE
        ));
      }
      
      // Get function body statements
      const statements: any[] = [];
      let bodyBlock = block.getInputTargetBlock('STACK');
      while (bodyBlock) {
        const statement = javascriptGenerator.blockToHighLevel(bodyBlock);
        if (statement) statements.push(statement);
        bodyBlock = bodyBlock.getNextBlock();
      }
      
      // Get return value
      const returnBlock = block.getInputTargetBlock('RETURN');
      let returnValue = null;
      if (returnBlock) {
        returnValue = javascriptGenerator.blockToHighLevel(returnBlock);
      }
      
      return {
        type: 'function_definition',
        name: funcName,
        arguments: args,
        hasReturn: true,
        body: statements,
        returnValue: returnValue
      };
    };
  }
  
  // Function call without return value
  if (javascriptGenerator.forBlock['procedures_callnoreturn']) {
    javascriptGenerator.forBlock['procedures_callnoreturn'].highLevel = function(block: Blockly.Block) {
      const funcName = javascriptGenerator.nameDB_!.getName(
        block.getFieldValue('NAME'),
        Blockly.Names.NameType.PROCEDURE
      );
      
      // Get argument values
      const argValues: any[] = [];
      // Use type assertion to access arguments_ property
      const arguments_ = (block as any).arguments_;
      if (arguments_) {
        for (let i = 0; i < arguments_.length; i++) {
          const argBlock = block.getInputTargetBlock('ARG' + i);
          if (argBlock) {
            const argValue = javascriptGenerator.blockToHighLevel(argBlock);
            argValues.push(argValue);
          } else {
            argValues.push(null);
          }
        }
      }
      
      return {
        type: 'function_call',
        name: funcName,
        arguments: argValues,
        hasReturn: false
      };
    };
  }
  
  // Function call with return value
  if (javascriptGenerator.forBlock['procedures_callreturn']) {
    javascriptGenerator.forBlock['procedures_callreturn'].highLevel = function(block: Blockly.Block) {
      const funcName = javascriptGenerator.nameDB_!.getName(
        block.getFieldValue('NAME'),
        Blockly.Names.NameType.PROCEDURE
      );
      
      // Get argument values
      const argValues: any[] = [];
      // Use type assertion to access arguments_ property
      const arguments_ = (block as any).arguments_;
      if (arguments_) {
        for (let i = 0; i < arguments_.length; i++) {
          const argBlock = block.getInputTargetBlock('ARG' + i);
          if (argBlock) {
            const argValue = javascriptGenerator.blockToHighLevel(argBlock);
            argValues.push(argValue);
          } else {
            argValues.push(null);
          }
        }
      }
      
      return {
        type: 'function_call',
        name: funcName,
        arguments: argValues,
        hasReturn: true
      };
    };
  }
}

// ======== Collapse/Expand Extension ========
function initCollapseExpandExtension() {
  if (!Blockly.Extensions.isRegistered('collapse_expand_control')) {
    // Define SVG icons as data URIs with white fill color
    const COLLAPSE_ICON = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="white" d="M3 6l7 7 7-7z"/></svg>';
    const EXPAND_ICON = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="white" d="M10 3l-7 7 7 7 7-7z" transform="rotate(90 10 10)"/></svg>';
    
    Blockly.Extensions.register('collapse_expand_control', function() {
      // Don't add collapse controls to blocks that can't be collapsed
      if (this.inputList.length === 0) {
        return;
      }

      // Check if the collapse field already exists - prevent duplicates
      if (this.getField('COLLAPSE_EXPAND')) {
        return; // Already has collapse icon
      }
      
      // Create collapse/expand icon using inline SVG data
      const collapseExpandField = new Blockly.FieldImage(
        COLLAPSE_ICON, // Using the data URI instead of file path
        18, 
        18,
        "",  // Alt text as string
        () => "Expand/Collapse block"  // Tooltip as function
      );
      
      // Add click handler
      collapseExpandField.setOnClickHandler(() => {
        this.setCollapsed(!this.isCollapsed());
      });
      
      // For blocks with a mutator or custom collapse behavior
      if ((this as any).mutator) {
        const input = this.appendDummyInput('COLLAPSE_INPUT');
        input.appendField(collapseExpandField, 'COLLAPSE_EXPAND');
      }
      // Otherwise add to the first visible field
      else {
        const input = this.inputList[0];
        if (input) {
          // Add field at the beginning of the input for better visibility
          input.insertFieldAt(0, collapseExpandField, 'COLLAPSE_EXPAND');
        }
      }
      
      // Listen for collapse events
      const blockId = this.id;
      const self = this;
      this.workspace.addChangeListener(function(event: any) {
        if (event.type === 'collapse' && event.blockId === blockId) {
          const iconField = self.getField('COLLAPSE_EXPAND');
          if (iconField) {
            iconField.setValue(event.collapsed ? EXPAND_ICON : COLLAPSE_ICON);
          }
        }
      });
      
      // Set initial state if block is already collapsed
      if (this.isCollapsed()) {
        const iconField = this.getField('COLLAPSE_EXPAND');
        if (iconField) {
          iconField.setValue(EXPAND_ICON);
        }
      }
    });
  }
}

// Function to apply collapse/expand extension to all block types
function applyCollapseExpandToAllBlocks() {
  // Get all registered block types
  const allBlockTypes = Object.keys(Blockly.Blocks);
  
  // Apply the extension to each block type
  allBlockTypes.forEach(blockType => {
    try {
      // Store the original init function
      const originalInit = Blockly.Blocks[blockType].init;
      
      // Override the init function to apply our extension
      Blockly.Blocks[blockType].init = function() {
        // Call the original init
        originalInit.call(this);
        
        // Apply our collapse/expand extension
        Blockly.Extensions.apply('collapse_expand_control', this, false);
      };
    } catch (e) {
      console.warn(`Couldn't apply collapse/expand extension to block type: ${blockType}`, e);
    }
  });
}

function initCustomCollapsedTextExtension() {
  if (!Blockly.Extensions.isRegistered('custom_collapsed_text_extension')) {
    Blockly.Extensions.register('custom_collapsed_text_extension', function() {
      const block = this;
      const originalToString = block.toString;
      
      block.toString = function(opt_maxLength) {
        if (this.isCollapsed()) {
          // Check for both regular and hidden field names
          const collapseText = this.getFieldValue('COLLAPSE_TEXT') || 
                              this.getFieldValue('COLLAPSE_TEXT_HIDDEN');
          return collapseText || originalToString.call(this, opt_maxLength);
        }
        return originalToString.call(this, opt_maxLength);
      };
    });
  }
}

function initCollapsedTextContextMenu() {
  if (!Blockly.Extensions.isRegistered('collapsed_text_context_menu')) {
    Blockly.Extensions.register('collapsed_text_context_menu', function() {
      // Store reference to block
      const block = this;
      
      // Save original contextMenu function if it exists
      const originalContextMenu = (this as any).customContextMenu;
      
      (this as any).customContextMenu = function(options: any) {
        // Call the original if it exists
        if (originalContextMenu) {
          originalContextMenu.call(this, options);
        }
        
        // Check for both regular and hidden field names
        const collapseField = block.getField('COLLAPSE_TEXT') || 
                             block.getField('COLLAPSE_TEXT_HIDDEN');
        
        // Add option to edit collapsed text if the field exists
        if (collapseField !== null) {
          options.push({
            text: 'Edit Collapsed View Text',
            enabled: true,
            callback: function() {
              // Get current collapsed text value - works with either field name
              const fieldName = block.getField('COLLAPSE_TEXT') ? 'COLLAPSE_TEXT' : 'COLLAPSE_TEXT_HIDDEN';
              const currentText = block.getFieldValue(fieldName) || '';
              
              // Prompt for new value
              const newText = prompt('Enter text to show when block is collapsed:', currentText);
              
              // Update if user didn't cancel
              if (newText !== null) {
                block.setFieldValue(newText, fieldName);
              }
            }
          });
        }
      };
    });
  }
}

// ======== Hidden Fields Extension ========
function initHiddenFieldsExtension() {
  if (!Blockly.Extensions.isRegistered('hidden_fields_extension')) {
    Blockly.Extensions.register('hidden_fields_extension', function() {
      // This extension makes fields with specific names stay hidden
      const block = this;
      
      // Function to hide fields marked as hidden
      const hideFields = () => {
        // Iterate over inputs directly since inputList is an array
        block.inputList.forEach(input => {
          if (input && input.fieldRow) {
            input.fieldRow.forEach(field => {
              if (field.name && (
                  field.name.endsWith('_HIDDEN') || 
                  ((block as any).blockConfig && 
                   (block as any).blockConfig.hiddenFields && 
                   (block as any).blockConfig.hiddenFields.includes(field.name))
              )) {
                field.setVisible(false);
              }
            });
          }
        });
      };
      
      // Apply immediately
      hideFields();
      
      // Listen for events that might cause re-rendering
      this.workspace.addChangeListener((event) => {
        if (event.type === Blockly.Events.BLOCK_CHANGE || 
            event.type === Blockly.Events.MOVE || 
            event.type === 'collapse' || 
            event.type === 'expand') {
          if ((event as any).blockId === block.id) {
            // Re-hide fields after specific events for this block
            setTimeout(hideFields, 0);
          }
        }
      });
    });
  }
}

// Helper function to hide fields with _HIDDEN suffix
function hideBlockHiddenFields(block: Blockly.Block) {
  console.log("Hiding fields for block", block.id);
  
  // Debug: log all inputs and fields to check structure
  console.log("Number of inputs:", block.inputList.length);
  
  block.inputList.forEach((input, i) => {
    console.log(`Input ${i}:`, input.type, input.name);
    
    if (input && input.fieldRow) {
      console.log(`Fields in input ${i}:`, input.fieldRow.length);
      
      input.fieldRow.forEach((field, j) => {
        console.log(`Field ${j} in input ${i}:`, field.name, field.constructor.name);
        
        if (field.name) {
          console.log(`Field name "${field.name}" ends with _HIDDEN:`, field.name.endsWith('_HIDDEN'));
          if (field.name.endsWith('_HIDDEN')) {
            console.log("Hiding field", field.name);
            field.setVisible(false);
          }
        } else {
          console.log("Field has no name");
        }
      });
    } else {
      console.log(`Input ${i} has no fieldRow`);
    }
  });
}

function enableHiddenFieldPersistence(workspace: Blockly.Workspace) {
  workspace.addChangeListener((event: any) => {
    // Handle any expand/collapse events regardless of how they were triggered
    if ((event.type === Blockly.Events.BLOCK_CHANGE && event.element === 'collapsed') || 
        event.type === 'expand' || 
        event.type === 'collapse') {
      console.log("Event", event);
      
      const blockId = event.blockId;
      if (blockId) {
        const block = workspace.getBlockById(blockId);
        if (block) {
          // Short delay to ensure rendering is complete
          setTimeout(() => {
            hideBlockHiddenFields(block);
            
          }, 10);
        }
      }
    }
  });
}

// ======== Main Initialization Function ========
export function initializeBlocklyOverrides(workspace: Blockly.Workspace) {
  // Skip if already initialized
  if (initialized) {
    console.log("Blockly overrides already initialized, skipping");
    return;
  }
  
  try {
    // Initialize all extensions
    initWebComponentExtensions();
    initCollapseExpandExtension();
    applyWebCompatibilityToProcedureBlocks();
    applyCollapseExpandToAllBlocks();
    overrideProcedureGenerators();
    overrideVariableGenerators();
    overrideMathGenerators();
    overrideTextGenerators();
    overrideListGenerators();
    initCustomCollapsedTextExtension();
    initCollapsedTextContextMenu();
    
    // Enable double-click to toggle collapse/expand blocks
    enableDoubleClickToggle(workspace);
    enableHiddenFieldPersistence(workspace);
    
    // Register high-level generators
    registerHighLevelGenerators();

    // Initialize hidden fields extension
    initHiddenFieldsExtension();
    
    // Import and initialize visibility extensions
    // This ensures both extension systems are initialized together
    import('./blockly-extensions.js').then(module => {
      module.initializeVisibilityExtensions();
    }).catch(err => {
      console.error("Error initializing visibility extensions:", err);
    });
    
    // Mark as initialized
    initialized = true;
    console.log("Blockly overrides initialized successfully");
  } catch (error) {
    console.error("Error initializing Blockly overrides:", error);
  }
}

function enableDoubleClickToggle(workspace: Blockly.Workspace) {
  // Add workspace click handler
  workspace.addChangeListener((event: any) => {
    if (event.type === Blockly.Events.CLICK) {
      const block = workspace.getBlockById(event.blockId);
      if (block) {
        // Check if this is a double click (within 500ms of last click)
        const now = Date.now();
        if ((block as any).lastClickTime && now - (block as any).lastClickTime < 300) {
          // Double click detected, toggle collapsed state
          block.setCollapsed(!block.isCollapsed());
        }
        // Store click time on the block
        (block as any).lastClickTime = now;
      }
    }
  });
} 
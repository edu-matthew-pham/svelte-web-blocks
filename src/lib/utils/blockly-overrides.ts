import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import { safeProcedureGeneration } from './procedure-generators.js';

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
  
  // Reset tracker when starting generation
  const originalInit = javascriptGenerator.init;
  javascriptGenerator.init = function(ws: Blockly.Workspace) {
    originalInit.call(this, ws);
    (this as any).definitions_ = Object.create(null);
    (this as any).functionNames_ = Object.create(null);
    VariableTracker.reset();
  };
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
    applyWebCompatibilityToProcedureBlocks();
    overrideProcedureGenerators();
    overrideVariableGenerators();
    
    // Mark as initialized
    initialized = true;
    console.log("Blockly overrides initialized successfully");
  } catch (error) {
    console.error("Error initializing Blockly overrides:", error);
  }
} 
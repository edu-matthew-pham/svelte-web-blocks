import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';

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
    // Prevent recursive calls
    if (inProcedureGeneration) {
      return null; // Return null to break recursion
    }
    
    inProcedureGeneration = true;
    
    try {
      // Extract function name and parameters
      let functionName = 'unnamed_procedure';
      let params = [];
      
      // Get function name
      if (block && block.getFieldValue) {
        const nameFromField = block.getFieldValue('NAME');
        if (nameFromField) functionName = nameFromField;
      }
      
      // Get parameters from mutation
      if (block && block.mutationToDom) {
        try {
          const mutation = block.mutationToDom();
          if (mutation) {
            // Extract parameters from arg elements
            for (let i = 0; i < mutation.childNodes.length; i++) {
              const child = mutation.childNodes[i];
              if (child.nodeName.toLowerCase() === 'arg') {
                // Type assertion to Element
                const argElement = child as Element;
                const paramName = argElement.getAttribute('name');
                if (paramName) params.push(paramName);
              }
            }
            console.log(`Extracted ${params.length} parameters for function ${functionName}:`, params);
          }
        } catch (e) {
          console.warn("Error extracting parameters from mutation:", e);
        }
      }
      
      // Try original generator
      try {
        const code = originalDefNoReturnGenerator.call(this, block);
        
        // Only return the original code if it's not empty
        if (code) {
          if (typeof code === 'string') {
            if (code.trim()) {
              inProcedureGeneration = false;
              return code;
            }
          } else if (Array.isArray(code) && typeof code[0] === 'string' && code[0].trim()) {
            inProcedureGeneration = false;
            return code;
          }
        }
        // If we get here, code exists but is empty or invalid
        throw new Error('Original generator returned empty code');
      } catch (originalError) {
        console.warn("Original generator failed, using fallback", originalError);
        
        // Create parameter list for function declaration
        const paramList = params.join(', ');
        
        // Get direct child blocks manually to avoid recursion
        let stackCode = '';
        if (block.getInput && block.getInput('STACK')) {
          const stackInput = block.getInput('STACK');
          if (stackInput && stackInput.connection && stackInput.connection.targetBlock()) {
            // Temporarily disable our generator to avoid recursion
            const tempGenerator = javascriptGenerator.forBlock['procedures_defnoreturn'];
            (javascriptGenerator as any).forBlock['procedures_defnoreturn'] = null;
            
            try {
              stackCode = javascriptGenerator.statementToCode(block, 'STACK');
            } catch (e) {
              console.warn("Error generating STACK code:", e);
            }
            
            // Restore our generator
            javascriptGenerator.forBlock['procedures_defnoreturn'] = tempGenerator;
          }
        }
        
        // If stackCode is empty, add a placeholder comment
        if (!stackCode || !stackCode.trim()) {
          stackCode = '  // Procedure body is empty\n';
        }
        
        inProcedureGeneration = false;
        return `// Fallback procedure definition
function ${functionName}(${paramList}) {
${stackCode}}`;
      }
      
      // Default fallback if all else fails
      inProcedureGeneration = false;
      return `function ${functionName}() {}\n`;
    } catch (e) {
      console.error('Error in procedures_defnoreturn generator:', e);
      inProcedureGeneration = false;
      return 'function unnamed_procedure() {}\n';
    }
  };
  
  // Similar improvements for procedures_defreturn
  javascriptGenerator.forBlock['procedures_defreturn'] = function(block) {
    try {
      // Check if block is valid before proceeding
      if (!block || typeof (block as any).getProcedureDef !== 'function') {
        console.warn('Invalid procedure block encountered');
        
        // Create a better fallback - a simple function declaration with return
        let functionName = 'unnamed_procedure';
        try {
          // Try to get the name from the field directly
          if (block && block.getFieldValue) {
            const nameFromField = block.getFieldValue('NAME');
            if (nameFromField) functionName = nameFromField;
          }
        } catch (fieldError) {
          console.warn('Could not extract procedure name from field:', fieldError);
        }
        
        return `// Fallback for procedure definition with return
function ${functionName}() {
  // Procedure body would go here
  return null;
}
`;
      }
      
      const code = originalDefReturnGenerator.call(this, block);
      return `<!-- Web Component Function with Return -->\n${code}\n<!-- End Web Component Function -->`;
    } catch (e) {
      console.error('Error in procedures_defreturn generator:', e);
      return '// Error generating procedure code\nfunction unnamed_procedure() { return null; }\n';
    }
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
      
      return `<!-- Calling Web Function -->\n${code}\n<!-- End Call -->`;
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
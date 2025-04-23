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

  // Override with web-component versions
  javascriptGenerator.forBlock['procedures_defnoreturn'] = function(block) {
    const code = originalDefNoReturnGenerator.call(this, block);
    return `<!-- Web Component Function -->\n${code}\n<!-- End Web Component Function -->`;
  };
  
  javascriptGenerator.forBlock['procedures_defreturn'] = function(block) {
    const code = originalDefReturnGenerator.call(this, block);
    return `<!-- Web Component Function with Return -->\n${code}\n<!-- End Web Component Function -->`;
  };
  
  javascriptGenerator.forBlock['procedures_callnoreturn'] = function(block) {
    const code = originalCallNoReturnGenerator.call(this, block);
    return `<!-- Calling Web Function -->\n${code}\n<!-- End Call -->`;
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
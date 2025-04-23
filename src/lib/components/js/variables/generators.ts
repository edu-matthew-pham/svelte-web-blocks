import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';



// Add type for the original init function
if (!('originalInit' in javascriptGenerator)) {
  (javascriptGenerator as any).originalInit = javascriptGenerator.init;
}


console.log("Procedure name: ", javascriptGenerator.getProcedureName('variables_set'));

// Log the variables_set generator
console.log("Variables set generator: ", (javascriptGenerator as any)['variables_set']);
console.log("Math arithmetic: ", (javascriptGenerator as any)['math_arithmetic']);

// Override the variables_set generator
(javascriptGenerator as any)['variables_set'] = function(block: Blockly.Block) {
  const variableName = javascriptGenerator.nameDB_!.getName(
    block.getFieldValue('VAR'),
    Blockly.Names.NameType.VARIABLE
  );
  const value = javascriptGenerator.valueToCode(
    block, 'VALUE', (javascriptGenerator as any).ORDER_ASSIGNMENT
  ) || '0';
  
  // Generate code that includes both declaration and assignment in one statement
  // Force the var keyword to be included directly in the output
  return `var ${variableName} = ${value};\n`;
};

/*
// We're not creating our own generator for variables_get, just making sure
// it doesn't create variable declarations outside the HTML
(javascriptGenerator as any)['variables_get'] = function(block: Blockly.Block) {
  const variableName = javascriptGenerator.nameDB_!.getName(
    block.getFieldValue('VAR'),
    Blockly.Names.NameType.VARIABLE
  );
  return [variableName, (javascriptGenerator as any).ORDER_ATOMIC];
};

// Tell the generator not to create any variable declarations at the top level
javascriptGenerator.init = function(workspace: Blockly.Workspace) {
  // Call the original init
  if ((this as any).originalInit) {
    (this as any).originalInit(workspace);
  }
  
  // Clear any variables that would be declared
  (this as any).definitions_ = Object.create(null);
  (this as any).functionNames_ = Object.create(null);
};

*/
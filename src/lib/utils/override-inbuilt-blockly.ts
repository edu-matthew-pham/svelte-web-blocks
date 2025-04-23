import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';

export const overrideBlocklyGenerators = (workspace: Blockly.Workspace) => {

    try {
        // First initialize the generator with the workspace
        //console.log("Initializing generator");
        //javascriptGenerator.init(workspace);

        console.log("Generator initialized: ", javascriptGenerator);
        
        // Now override after initialization is complete
        console.log("Overriding variables_set generator");

        console.log("Variables set generator: ", javascriptGenerator.forBlock['variables_set']);
        
        // Override the variables_set generator correctly using the forBlock property
        javascriptGenerator.forBlock['variables_set'] = function(block: Blockly.Block) {
            const variableName = javascriptGenerator.nameDB_!.getName(
                block.getFieldValue('VAR'),
                Blockly.Names.NameType.VARIABLE
            );
            const value = javascriptGenerator.valueToCode(
                block, 'VALUE', (javascriptGenerator as any).ORDER_ASSIGNMENT
            ) || '0';
            
            // Generate code with var declaration inline
            return `var ${variableName} = ${value};\n`;
        };

        console.log("Variables set generator (after override): ", javascriptGenerator.forBlock['variables_set']);

        
        
        // Tell the generator not to create any variable declarations at the top level
        const originalInit = javascriptGenerator.init;
        javascriptGenerator.init = function(ws: Blockly.Workspace) {
            // Call original init
            originalInit.call(this, ws);
            
            // Clear declarations so they don't appear at the top level
            (this as any).definitions_ = Object.create(null);
            (this as any).functionNames_ = Object.create(null);
        };
        
    } catch (error) {
        console.error("Error initializing generator: ", error);
    }
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
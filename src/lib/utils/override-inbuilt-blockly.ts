import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';

// Create a dedicated module for variable tracking
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

export const overrideBlocklyGenerators = (workspace: Blockly.Workspace) => {

    try {

        // Override the variables_set generator correctly using the forBlock property
        javascriptGenerator.forBlock['variables_set'] = function(block: Blockly.Block) {
            const variableId = block.getFieldValue('VAR');
            const variableName = javascriptGenerator.nameDB_!.getName(
                variableId,
                Blockly.Names.NameType.VARIABLE
            );
            
            const value = javascriptGenerator.valueToCode(
                block, 'VALUE', (javascriptGenerator as any).ORDER_ASSIGNMENT
            ) || '0';
            
            // Use your dedicated tracker
            if (VariableTracker.isDeclared(variableId)) {
                return `${variableName} = ${value};\n`;
            } else {
                VariableTracker.markAsDeclared(variableId);
                return `var ${variableName} = ${value};\n`;
            }
        };

        console.log("Variables set generator (after override): ", javascriptGenerator.forBlock['variables_set']);
        
        // Reset tracker when starting generation
        const originalInit = javascriptGenerator.init;
        javascriptGenerator.init = function(ws: Blockly.Workspace) {
            originalInit.call(this, ws);
            (this as any).definitions_ = Object.create(null);
            (this as any).functionNames_ = Object.create(null);
            
            // Reset your tracker
            VariableTracker.reset();
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
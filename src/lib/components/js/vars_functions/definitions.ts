import * as Blockly from 'blockly';
import type { WebBlockDefinitions } from '$lib/types.js';

// Standard Blockly blocks for variables and functions are already defined
// This file can be used to extend them with custom behavior if needed

/**
 * Add any custom overrides or extensions to the standard blocks here
 */
export function initVariableAndFunctionBlocks(): WebBlockDefinitions {
  // The standard blocks we're using from the toolbox
  const blockTypes = [
    'variables_set',
    'variables_get',
    'procedures_defnoreturn',
    'procedures_defreturn',
    'procedures_callnoreturn',
    'procedures_callreturn'
  ];
  
  // Create an empty definitions object
  const definitions: WebBlockDefinitions = {};
  
  // For each block type, we can add custom extensions or modifications
  // if needed without replacing the original definitions
  blockTypes.forEach(type => {
    // Get the original block definition
    const originalBlock = Blockly.Blocks[type];
    
    if (originalBlock) {
      // Create a new definition that extends the original
      definitions[type] = {
        init: function(this: Blockly.Block) {
          // Call the original init function to set up the block
          originalBlock.init.call(this);
          
          // Add any customizations here
          // For example, you could modify colors, add custom tooltips, etc.
          
          // Example (uncomment if you want to customize):
           if (type.startsWith('variables_')) {
             this.setColour(290); // Match the colour in toolbox.xml
           } else if (type.startsWith('procedures_')) {
             this.setColour(290); // Match the colour in toolbox.xml
           }
        }
      };
    }
  });
  
  return definitions;
}

// Export the block definitions for use in your application
export const variableFunctionBlocks = initVariableAndFunctionBlocks(); 
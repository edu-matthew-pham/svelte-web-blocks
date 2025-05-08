import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import type { WebBlockGeneratorFunctions } from '$lib/types.js';

// Define logic generators
export const logicGenerators: WebBlockGeneratorFunctions = {
  expression_compare: {
    html: function(block: Blockly.Block) {
      // Get the expression from the field
      const expression = block.getFieldValue('EXPRESSION') || '';
      
      // We wrap the expression in parentheses to ensure proper precedence
      // Then return it with the appropriate ORDER value for expressions
      return [`(${expression})`, (javascriptGenerator as any).ORDER_ATOMIC] as any;
    },
    
    highLevel: function(block: Blockly.Block) {
      const expression = block.getFieldValue('EXPRESSION') || '';
      
      return {
        type: 'expression_compare',
        properties: {
          expression: expression
        }
      };
    }
  },
  
  // Add more logic block generators here as needed
}; 
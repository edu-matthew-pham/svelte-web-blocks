import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import { createGenerator } from '$lib/utils/generator-factory.js';
import type { WebBlockGeneratorFunctions } from '$lib/types.js';

// Define variable generators
export const variableGenerators: WebBlockGeneratorFunctions = {
  console_log: {
    html: function(block: Blockly.Block) {
      const value = javascriptGenerator.valueToCode(
        block, 'TEXT', (javascriptGenerator as any).ORDER_NONE
      ) || '""';
      
      return `console.log(${value});`;
    },
    
    highLevel: function(block: Blockly.Block) {
      const value = javascriptGenerator.valueToCode(
        block, 'TEXT', (javascriptGenerator as any).ORDER_NONE
      ) || '""';
      
      return {
        type: 'console_log',
        value: value
      };
    }
  }
};
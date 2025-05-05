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
      // Get the input value block directly
      const valueBlock = block.getInputTargetBlock('TEXT');
      let value = null;
      
      if (valueBlock) {
        // Get the high-level representation of the value
        value = javascriptGenerator.blockToHighLevel(valueBlock);
      }
      
      return {
        type: 'console_log',
        properties: {
          value: value
        }
      };
    }
  },
  
  text_multiline_js: {
    html: function(block: Blockly.Block) {
      // Get the multiline text value
      const text = block.getFieldValue('TEXT') || '';
      
      // Properly escape the text for JavaScript and maintain line breaks
      const escapedText = text
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n');
        
      // Cast the return value to any to bypass the type check
      return [`"${escapedText}"`, (javascriptGenerator as any).ORDER_ATOMIC] as any;
    },
    
    highLevel: function(block: Blockly.Block) {
      const text = block.getFieldValue('TEXT') || '';
      
      return {
        type: 'text_multiline_js',
        properties: {
          value: text,
          lineCount: text.split('\n').length
        }
      };
    }
  }
};
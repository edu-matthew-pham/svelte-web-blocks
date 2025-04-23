/**
 * Variable and function component definitions
 */
import { createBlockDefinitions } from '$lib/utils/block-factory.js';
import type { WebBlockConfigs } from '$lib/types.js';



// Define variable block configurations
const variableBlockConfigs: WebBlockConfigs = {

  variables_init: {
    type: 'variables_init',
    category: 'variables',
    color: 290,
    tooltip: "Create a variable",
    helpUrl: "https://developers.google.com/blockly/guides/create-custom-blocks/variables",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Create variable" },
        { type: "field_variable", name: "VAR", variable: "myVariable" }
      ]}
    ],
    connections: { output: "false" }
  },
  text_multiline_js: {
    type: 'text_multiline_js',
    category: 'item',
    
    color: 180,
    tooltip: "A multiline text string as a JavaScript value",
    helpUrl: "",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "\"" },
        { type: "field_multiline", name: "TEXT", default: "line 1\nline 2\nline 3" },
        { type: "label", text: "\"" },
      ]}
    ],
    connections: { output: "js_value" }
  },
  
  variables_set_sequence: {
    type: 'variables_set_sequence',
    category: 'variables',
    color: 290,
    tooltip: "Create a variable and set its value twice",
    helpUrl: "https://developers.google.com/blockly/guides/create-custom-blocks/variables",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Create variable" },
        { type: "field_variable", name: "VAR", variable: "myVariable" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Initial value" }
      ]},
      { type: "input_value", name: "INITIAL", check: "String" },
      { type: "row", children: [
        { type: "label", text: "New value" }
      ]},
      { type: "input_value", name: "NEW_VALUE", check: "String" }
    ],
    connections: { previous: "web_component", next: "web_component" },
    // This is important - tells Blockly to use the built-in variables_set block
    blockBuilderFn: function(block) {
      // This function will generate the actual blocks when this custom block is used
      // It creates two variables_set blocks connected with 'next'
      return {
        type: 'variables_set',
        fields: {
          VAR: block.getFieldValue('VAR')
        },
        inputs: {
          VALUE: block.getInputTargetBlock('INITIAL')
        },
        next: {
          type: 'variables_set',
          fields: {
            VAR: block.getFieldValue('VAR')
          },
          inputs: {
            VALUE: block.getInputTargetBlock('NEW_VALUE')
          }
        }
      };
    }
  },
  
  console_log: {
    type: 'console_log',
    category: 'variables',
    color: 290,
    tooltip: "Log a message to the console",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/API/console/log",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "console.log(" },
        { type: "input_value", name: "TEXT" },
        { type: "label", text: ")" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" }
  }
};

// Create and export the variable and function block definitions
export const variableDefinitions = createBlockDefinitions(variableBlockConfigs);

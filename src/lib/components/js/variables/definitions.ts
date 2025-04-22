/**
 * Variable and function component definitions
 */
import { createBlockDefinitions } from '$lib/utils/block-factory.js';
import type { WebBlockConfigs } from '$lib/types.js';

// Define variable block configurations
const variableBlockConfigs: WebBlockConfigs = {
  variables_set: {
    type: 'variables_set',
    category: 'js',
    color: 290,
    tooltip: "Set a variable's value",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var",
    inputs: [
      { 
        type: "field_variable", 
        name: "VAR",
        variable: "myVariable"
      },
      {
        type: "input_value",
        name: "VALUE"
      }
    ],
    connections: { previous: "js_statement", next: "js_statement" }
  },
  
  variables_get: {
    type: 'variables_get',
    category: 'js',
    color: 290,
    tooltip: "Returns the value of this variable",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var",
    inputs: [
      { 
        type: "field_variable", 
        name: "VAR",
        variable: "myVariable"
      }
    ],
    connections: { output: "js_value" }
  },
  
  procedures_defnoreturn: {
    type: 'procedures_defnoreturn',
    category: 'js',
    color: 290,
    tooltip: "Define a function with no return value",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions",
    inputs: [
      {
        type: "field_input",
        name: "NAME",
        text: "myFunction"
      }
    ],
    connections: { previous: "js_statement", next: "js_statement" }
  },
  
  procedures_defreturn: {
    type: 'procedures_defreturn',
    category: 'js',
    color: 290,
    tooltip: "Define a function that returns a value",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions",
    inputs: [
      {
        type: "field_input",
        name: "NAME",
        text: "myFunctionWithReturn"
      },
      {
        type: "input_value",
        name: "RETURN",
        check: "js_value"
      }
    ],
    connections: { previous: "js_statement", next: "js_statement" }
  },
  
  procedures_callnoreturn: {
    type: 'procedures_callnoreturn',
    category: 'js',
    color: 290,
    tooltip: "Call a function with no return value",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions",
    inputs: [
      {
        type: "field_input",
        name: "NAME",
        text: "myFunction"
      }
    ],
    connections: { previous: "js_statement", next: "js_statement" }
  },
  
  procedures_callreturn: {
    type: 'procedures_callreturn',
    category: 'js',
    color: 290,
    tooltip: "Call a function that returns a value",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions",
    inputs: [
      {
        type: "field_input",
        name: "NAME",
        text: "myFunctionWithReturn"
      }
    ],
    connections: { output: "js_value" }
  }
};

// Create and export the variable and function block definitions
export const variableDefinitions = createBlockDefinitions(variableBlockConfigs);

/**
 * Variable and function component definitions
 */
import { createBlockDefinitions } from '$lib/utils/block-factory.js';
import type { WebBlockConfigs } from '$lib/types.js';



// Define variable block configurations
const variableBlockConfigs: WebBlockConfigs = {


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

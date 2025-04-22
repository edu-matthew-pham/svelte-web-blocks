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
  }
};

// Create and export the variable and function block definitions
export const variableDefinitions = createBlockDefinitions(variableBlockConfigs);

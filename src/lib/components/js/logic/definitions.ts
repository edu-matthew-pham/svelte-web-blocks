import { createBlockDefinitions } from '$lib/utils/block-factory.js';
import type { WebBlockConfigs } from '$lib/types.js';
import * as Blockly from 'blockly/core';

// Define logic block configurations
const logicConfigs: WebBlockConfigs = {
  expression_compare: {
    type: 'expression_compare',
    category: 'logic',
    color: 210,
    tooltip: "Evaluate a JavaScript comparison expression",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#comparison_operators",
    inputs: [
      { type: "row", children: [
        { type: "field_multiline", name: "EXPRESSION", default: "x > 0 && y < 10" }
      ]}
    ],
    connections: { output: "Boolean" },
    schema: {
      type: "object",
      title: "JavaScript Expression",
      description: "Evaluate a JavaScript expression that returns a boolean",
      properties: {
        EXPRESSION: {
          type: "string",
          description: "JavaScript comparison expression",
          default: "x > 0 && y < 10"
        }
      },
      required: ["EXPRESSION"]
    }
  }
}

// Create and export the logic block definitions
export const logicDefinitions = createBlockDefinitions(logicConfigs); 
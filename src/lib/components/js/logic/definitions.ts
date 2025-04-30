import { createBlockDefinitions } from '$lib/utils/block-factory.js';
import type { WebBlockConfigs } from '$lib/types.js';
import * as Blockly from 'blockly/core';

// Define logic block configurations
const logicConfigs: WebBlockConfigs = {
  // Universal Logic operations (AND, OR, NOT)
  js_universal_logic: {
    type: 'js_universal_logic',
    category: 'logic',
    color: 210,
    tooltip: "Apply logical operations to boolean values",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_Operators",
    inputs: [
      { type: "row", children: [
        { type: "field_dropdown", name: "OP", options: [
          ["and", "AND"],
          ["or", "OR"],
          ["not", "NOT"]
        ]},
        { type: "input_value", name: "A", check: "Boolean" }
      ]},
      { type: "row", children: [
        { type: "input_value", name: "B", check: "Boolean" }
      ]}
    ],
    connections: { output: "Boolean" },
    schema: {
      type: "object",
      title: "Logical Operation",
      description: "Apply logical operations to boolean values",
      properties: {
        OP: {
          type: "string",
          description: "Logical operation to perform",
          enum: ["AND", "OR", "NOT"],
          default: "AND"
        },
        A: {
          type: "boolean",
          description: "First boolean value"
        },
        B: {
          type: "boolean",
          description: "Second boolean value (not used for NOT operation)"
        }
      },
      required: ["OP", "A"]
    },
    extensions: ["dynamic_logic_inputs"]
  },
  
  // Universal Comparison operations
  js_universal_comparison: {
    type: 'js_universal_comparison',
    category: 'logic',
    color: 210,
    tooltip: "Compare values with various operators",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators",
    inputs: [
      { type: "row", children: [
        { type: "input_value", name: "A" },
        { type: "field_dropdown", name: "OP", options: [
          ["=", "EQ"],
          ["≠", "NEQ"],
          [">", "GT"],
          ["<", "LT"],
          ["≥", "GTE"],
          ["≤", "LTE"]
        ]},
        { type: "input_value", name: "B" }
      ]}
    ],
    connections: { output: "Boolean" },
    schema: {
      type: "object",
      title: "Comparison Operation",
      description: "Compare values with various operators",
      properties: {
        A: {
          type: "any",
          description: "First value to compare"
        },
        OP: {
          type: "string",
          description: "Comparison operator",
          enum: ["EQ", "NEQ", "GT", "LT", "GTE", "LTE"],
          default: "EQ"
        },
        B: {
          type: "any",
          description: "Second value to compare"
        }
      },
      required: ["A", "OP", "B"]
    }
  },
  
  // Ternary conditional operation
  js_universal_ternary: {
    type: 'js_universal_ternary',
    category: 'logic',
    color: 210,
    tooltip: "Choose between two values based on a condition",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "if" },
        { type: "input_value", name: "CONDITION", check: "Boolean" }
      ]},
      { type: "row", children: [
        { type: "label", text: "then" },
        { type: "input_value", name: "THEN" }
      ]},
      { type: "row", children: [
        { type: "label", text: "else" },
        { type: "input_value", name: "ELSE" }
      ]}
    ],
    connections: { output: false },
    schema: {
      type: "object",
      title: "Conditional (Ternary) Operator",
      description: "Choose between two values based on a condition",
      properties: {
        CONDITION: {
          type: "boolean",
          description: "The condition to evaluate"
        },
        THEN: {
          type: "any",
          description: "Value to return if condition is true"
        },
        ELSE: {
          type: "any",
          description: "Value to return if condition is false"
        }
      },
      required: ["CONDITION", "THEN", "ELSE"]
    }
  }
};

// Extension to dynamically adjust inputs for logical operations
Blockly.Extensions.register('dynamic_logic_inputs', function() {
  // Only show input B for AND and OR operations, hide for NOT
  const thisBlock = this as any;
  thisBlock.updateShape_ = function() {
    const operation = thisBlock.getFieldValue('OP');
    const hasSecondInput = (operation !== 'NOT');
    
    if (hasSecondInput && !thisBlock.getInput('B')) {
      thisBlock.appendValueInput('B')
          .setCheck('Boolean');
    } else if (!hasSecondInput && thisBlock.getInput('B')) {
      thisBlock.removeInput('B');
    }
  };
  
  // Update when the operation changes
  thisBlock.setOnChange(function(changeEvent: Blockly.Events.Abstract) {
    if (changeEvent.type === Blockly.Events.BLOCK_CHANGE) {
      const change = changeEvent as Blockly.Events.BlockChange;
      if (change.element === 'field' && change.name === 'OP') {
        thisBlock.updateShape_();
      }
    }
  });
  
  // Initialize shape
  thisBlock.updateShape_();
});

// Create and export the logic block definitions
export const logicDefinitions = createBlockDefinitions(logicConfigs); 
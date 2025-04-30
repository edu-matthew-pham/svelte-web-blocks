import { createBlockDefinitions } from '$lib/utils/block-factory.js';
import type { WebBlockConfigs } from '$lib/types.js';
import * as Blockly from 'blockly/core';

// Define operations block configurations
const operationsBlockConfigs: WebBlockConfigs = {
  // Universal Math binary operation
  js_universal_math: {
    type: 'js_universal_math',
    category: 'operations',
    color: 230,
    tooltip: "Perform math operations with two values",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators",
    inputs: [
      { type: "row", children: [
        { type: "input_value", name: "A", check: "Number" },
        { type: "field_dropdown", name: "OP", options: [
          ["+", "ADD"],
          ["-", "SUBTRACT"],
          ["×", "MULTIPLY"],
          ["÷", "DIVIDE"],
          ["%", "MODULO"],
          ["^", "POWER"]
        ]},
        { type: "input_value", name: "B", check: "Number" }
      ]}
    ],
    connections: { output: "Number" },
    schema: {
      type: "object",
      title: "Math Binary Operation",
      description: "Perform math operations with two values",
      properties: {
        A: {
          type: "number",
          description: "First value"
        },
        OP: {
          type: "string",
          description: "Operation to perform",
          enum: ["ADD", "SUBTRACT", "MULTIPLY", "DIVIDE", "MODULO", "POWER"],
          default: "ADD"
        },
        B: {
          type: "number",
          description: "Second value"
        }
      },
      required: ["A", "OP", "B"]
    }
  },
  
  // Universal Math functions
  js_universal_math_functions: {
    type: 'js_universal_math_functions',
    category: 'operations',
    color: 230,
    tooltip: "Apply mathematical functions to values",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math",
    mutator: "math_function_mutator",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Math" },
        { type: "field_dropdown", name: "FUNCTION_CATEGORY", options: [
          ["Basic", "BASIC"],
          ["Trigonometry", "TRIG"],
          ["Advanced", "ADVANCED"],
          ["Constants", "CONSTANTS"]
        ]},
        { type: "field_dropdown", name: "FUNCTION", options: [
          ["square root", "sqrt"],
          ["absolute", "abs"],
          ["negative", "neg"],
          ["ln", "log"],
          ["log10", "log10"],
          ["e^", "exp"],
          ["floor", "floor"],
          ["ceiling", "ceil"],
          ["round", "round"]
        ]}
      ]},
      { type: "row", children: [
        { type: "input_value", name: "NUM", check: "Number" }
      ]}
    ],
    connections: { output: "Number" },
    schema: {
      type: "object",
      title: "Math Function",
      description: "Apply mathematical functions to values",
      properties: {
        FUNCTION_CATEGORY: {
          type: "string",
          description: "Category of mathematical function",
          enum: ["BASIC", "TRIG", "ADVANCED", "CONSTANTS"],
          default: "BASIC"
        },
        FUNCTION: {
          type: "string",
          description: "Mathematical function to apply",
          enum: ["sqrt", "abs", "neg", "log", "log10", "exp", "floor", "ceil", "round", 
                "sin", "cos", "tan", "asin", "acos", "atan", "atan2", 
                "pow", "min", "max", "random", "PI", "E", "GOLDEN_RATIO"],
          default: "sqrt"
        },
        NUM: {
          type: "number",
          description: "Input value"
        },
        NUM2: {
          type: "number",
          description: "Second input value (for functions that need two inputs)"
        }
      },
      required: ["FUNCTION"]
    },
    extensions: ["dynamic_math_inputs"]
  },
  
  // Universal Text operation
  js_universal_text_operation: {
    type: 'js_universal_text_operation',
    category: 'operations',
    color: 230,
    tooltip: "Perform operations on text",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String",
    inputs: [
      { type: "row", children: [
        { type: "field_dropdown", name: "OP", options: [
          ["length of", "LENGTH"],
          ["to uppercase", "UPPERCASE"],
          ["to lowercase", "LOWERCASE"],
          ["trim whitespace from", "TRIM"],
          ["get letter # from", "CHAR_AT"],
          ["find position of", "INDEX_OF"],
          ["substring from", "SUBSTRING"]
        ]},
        { type: "input_value", name: "TEXT", check: "String" }
      ]},
      { type: "row", children: [
        { type: "input_value", name: "PARAM1", check: "Number" }
      ]},
      { type: "row", children: [
        { type: "label", text: "to" },
        { type: "input_value", name: "PARAM2", check: "Number" }
      ]}
    ],
    connections: { output: "String|Number" },
    schema: {
      type: "object",
      title: "Text Operation",
      description: "Perform operations on text",
      properties: {
        OP: {
          type: "string",
          description: "Operation to perform on text",
          enum: ["LENGTH", "UPPERCASE", "LOWERCASE", "TRIM", "CHAR_AT", "INDEX_OF", "SUBSTRING"],
          default: "LENGTH"
        },
        TEXT: {
          type: "string",
          description: "Text to operate on"
        },
        PARAM1: {
          type: "number",
          description: "First parameter (if needed)"
        },
        PARAM2: {
          type: "number",
          description: "Second parameter (if needed)"
        }
      },
      required: ["OP", "TEXT"]
    },
    extensions: ["dynamic_text_inputs"]
  },
  
  // Universal Text join
  js_universal_text_join: {
    type: 'js_universal_text_join',
    category: 'operations',
    color: 230,
    tooltip: "Join multiple texts together",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/concat",
    mutator: "text_join_mutator",
    inputs: [
      { type: "label", text: "join" },
      { type: "row", children: [
        { type: "input_value", name: "ADD0", check: "String" }
      ]},
      { type: "row", children: [
        { type: "input_value", name: "ADD1", check: "String" }
      ]}
    ],
    connections: { output: "String" },
    schema: {
      type: "object",
      title: "Join Text",
      description: "Join multiple texts together",
      properties: {
        ADD: {
          type: "array",
          description: "Texts to join",
          items: {
            type: "string"
          }
        }
      }
    }
  },
  
  // Universal List create
  js_universal_list_create: {
    type: 'js_universal_list_create',
    category: 'operations',
    color: 230,
    tooltip: "Create a list with items",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
    mutator: "list_create_mutator",
    inputs: [
      { type: "label", text: "create list with" },
      { type: "row", children: [
        { type: "input_value", name: "ADD0" }
      ]},
      { type: "row", children: [
        { type: "input_value", name: "ADD1" }
      ]}
    ],
    connections: { output: "Array" },
    schema: {
      type: "object",
      title: "Create List",
      description: "Create a list with items",
      properties: {
        ADD: {
          type: "array",
          description: "Items to add to the list",
          items: {
            type: "any"
          }
        }
      }
    }
  },
  
  // Universal List operation
  js_universal_list_operation: {
    type: 'js_universal_list_operation',
    category: 'operations',
    color: 230,
    tooltip: "Perform operations on lists",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
    inputs: [
      { type: "row", children: [
        { type: "field_dropdown", name: "OP", options: [
          ["length of", "LENGTH"],
          ["is empty", "IS_EMPTY"],
          ["get item #", "GET"],
          ["find first occurrence of", "INDEXOF"],
          ["contains item", "CONTAINS"],
          ["get first item", "FIRST"],
          ["get last item", "LAST"],
          ["get random item", "RANDOM"]
        ]},
        { type: "input_value", name: "LIST", check: "Array" }
      ]},
      { type: "row", children: [
        { type: "input_value", name: "PARAM" }
      ]}
    ],
    connections: { output: false },
    schema: {
      type: "object",
      title: "List Operation",
      description: "Perform operations on lists",
      properties: {
        OP: {
          type: "string",
          description: "Operation to perform on the list",
          enum: ["LENGTH", "IS_EMPTY", "GET", "INDEXOF", "CONTAINS", "FIRST", "LAST", "RANDOM"],
          default: "LENGTH"
        },
        LIST: {
          type: "array",
          description: "List to operate on"
        },
        PARAM: {
          type: "any",
          description: "Parameter for operation (if needed)"
        }
      },
      required: ["OP", "LIST"]
    },
    extensions: ["dynamic_list_inputs"]
  },
  
  // Universal List transform
  js_universal_list_transform: {
    type: 'js_universal_list_transform',
    category: 'operations',
    color: 230,
    tooltip: "Transform lists with various operations",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
    inputs: [
      { type: "row", children: [
        { type: "field_dropdown", name: "OP", options: [
          ["add item", "PUSH"], 
          ["insert at #", "INSERT"],
          ["set item #", "SET"],
          ["remove item #", "REMOVE_INDEX"],
          ["remove first occurrence", "REMOVE_ITEM"],
          ["get sub-list from", "SUBLIST"],
          ["reverse", "REVERSE"],
          ["sort (numbers)", "SORT_NUM"],
          ["sort (text)", "SORT_TEXT"],
          ["shuffle", "SHUFFLE"]
        ]},
        { type: "input_value", name: "LIST", check: "Array" }
      ]},
      { type: "row", children: [
        { type: "label", text: "item" },
        { type: "input_value", name: "ITEM" }
      ]},
      { type: "row", children: [
        { type: "label", text: "index" },
        { type: "input_value", name: "INDEX", check: "Number" }
      ]},
      { type: "row", children: [
        { type: "label", text: "to" },
        { type: "input_value", name: "END", check: "Number" }
      ]}
    ],
    connections: { output: "Array" },
    schema: {
      type: "object",
      title: "Transform List",
      description: "Transform lists with various operations",
      properties: {
        OP: {
          type: "string",
          description: "Operation to transform the list",
          enum: ["PUSH", "INSERT", "SET", "REMOVE_INDEX", "REMOVE_ITEM", 
                "SUBLIST", "REVERSE", "SORT_NUM", "SORT_TEXT", "SHUFFLE"],
          default: "PUSH"
        },
        LIST: {
          type: "array",
          description: "List to transform"
        },
        ITEM: {
          type: "any",
          description: "Item for operation (if needed)"
        },
        INDEX: {
          type: "number",
          description: "Index for operation (if needed)"
        },
        END: {
          type: "number",
          description: "End index for sublist operation (if needed)"
        }
      },
      required: ["OP", "LIST"]
    },
    extensions: ["dynamic_list_transform_inputs"]
  }
};

// Extensions for dynamic inputs
Blockly.Extensions.register('dynamic_math_inputs', function() {
  // Implementation to dynamically show/hide inputs based on function selection
  // Will handle showing different parameters for different math functions
});

Blockly.Extensions.register('dynamic_text_inputs', function() {
  // Implementation to show/hide param inputs based on text operation
});

Blockly.Extensions.register('dynamic_list_inputs', function() {
  // Implementation to show/hide param inputs based on list operation
});

Blockly.Extensions.register('dynamic_list_transform_inputs', function() {
  // Implementation to show/hide item, index, end inputs based on transform operation
});

// Create and export the operations block definitions
export const operationsDefinitions = createBlockDefinitions(operationsBlockConfigs); 
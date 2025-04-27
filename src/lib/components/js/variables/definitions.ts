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
    connections: { output: "js_value" },
    schema: {
      type: "object",
      title: "Multiline Text",
      description: "A multiline text string as a JavaScript value",
      properties: {
        TEXT: {
          type: "string",
          description: "Multiline text content",
          default: "line 1\nline 2\nline 3"
        }
      },
      required: ["TEXT"]
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
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Console Log",
      description: "Log a message to the console for debugging",
      properties: {
        TEXT: {
          type: "string",
          description: "Value or expression to log to the console"
        }
      },
      required: ["TEXT"]
    }
  },
  
  js_variable_declaration: {
    type: 'js_variable_declaration',
    category: 'variables',
    color: 290,
    tooltip: "Declare a JavaScript variable",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let",
    inputs: [
      { type: "row", children: [
        { type: "field_dropdown", name: "TYPE", options: [
          ["let", "let"],
          ["const", "const"],
          ["var", "var"]
        ]},
        { type: "field_text", name: "NAME", default: "myVariable" },
        { type: "label", text: "=" },
        { type: "input_value", name: "VALUE" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Variable Declaration",
      description: "Declare a JavaScript variable with a value",
      properties: {
        TYPE: {
          type: "string",
          description: "Type of variable declaration",
          enum: ["let", "const", "var"],
          default: "let"
        },
        NAME: {
          type: "string",
          description: "Variable name",
          default: "myVariable"
        },
        VALUE: {
          type: "string",
          description: "Initial value for the variable"
        }
      },
      required: ["TYPE", "NAME"]
    }
  },
  
  js_variable_assignment: {
    type: 'js_variable_assignment',
    category: 'variables',
    color: 290,
    tooltip: "Assign a value to an existing variable",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Assignment",
    inputs: [
      { type: "row", children: [
        { type: "field_text", name: "NAME", default: "myVariable" },
        { type: "label", text: "=" },
        { type: "input_value", name: "VALUE" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Variable Assignment",
      description: "Assign a new value to an existing variable",
      properties: {
        NAME: {
          type: "string",
          description: "Variable name",
          default: "myVariable"
        },
        VALUE: {
          type: "string",
          description: "New value for the variable"
        }
      },
      required: ["NAME", "VALUE"]
    }
  },
  
  js_variable_get: {
    type: 'js_variable_get',
    category: 'variables',
    color: 290,
    tooltip: "Get the value of a variable",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Assignment",
    inputs: [
      { type: "row", children: [
        { type: "field_text", name: "NAME", default: "myVariable" }
      ]}
    ],
    connections: { output: "js_value" },
    schema: {
      type: "object",
      title: "Get Variable",
      description: "Get the value of a variable",
      properties: {
        NAME: {
          type: "string",
          description: "Variable name to retrieve",
          default: "myVariable"
        }
      },
      required: ["NAME"]
    }
  },
  
  js_array_literal: {
    type: 'js_array_literal',
    category: 'variables',
    color: 290,
    tooltip: "Create an array with specified items",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "[" },
        { type: "field_multiline", name: "ITEMS", default: "\"item1\",\n\"item2\",\n\"item3\"" },
        { type: "label", text: "]" }
      ]}
    ],
    connections: { output: "js_value" },
    schema: {
      type: "object",
      title: "Array Literal",
      description: "Create an array with specified items",
      properties: {
        ITEMS: {
          type: "string",
          description: "Comma-separated array items",
          default: "\"item1\",\n\"item2\",\n\"item3\""
        }
      },
      required: ["ITEMS"]
    }
  },
  
  js_object_literal: {
    type: 'js_object_literal',
    category: 'variables',
    color: 290,
    tooltip: "Create a JavaScript object with properties",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "{" },
        { type: "field_multiline", name: "PROPERTIES", default: "name: \"John\",\nage: 30,\nisActive: true" },
        { type: "label", text: "}" }
      ]}
    ],
    connections: { output: "js_value" },
    schema: {
      type: "object",
      title: "Object Literal",
      description: "Create a JavaScript object with properties",
      properties: {
        PROPERTIES: {
          type: "string",
          description: "Object properties in key-value format",
          default: "name: \"John\",\nage: 30,\nisActive: true"
        }
      },
      required: ["PROPERTIES"]
    }
  },
  
  js_function_definition: {
    type: 'js_function_definition',
    category: 'variables',
    color: 290,
    tooltip: "Define a JavaScript function",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "function" },
        { type: "field_text", name: "NAME", default: "myFunction" },
        { type: "label", text: "(" },
        { type: "field_text", name: "PARAMS", default: "param1, param2" },
        { type: "label", text: ")" }
      ]},
      { type: "statement", name: "BODY", check: "web_component", label: "Function Body" }
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Function Definition",
      description: "Define a JavaScript function with parameters",
      properties: {
        NAME: {
          type: "string",
          description: "Function name",
          default: "myFunction"
        },
        PARAMS: {
          type: "string",
          description: "Comma-separated parameter names",
          default: "param1, param2"
        },
        BODY: {
          type: "array",
          description: "Function body statements",
          items: {
            type: "object"
          }
        }
      },
      required: ["NAME"]
    }
  },
  
  js_function_call: {
    type: 'js_function_call',
    category: 'variables',
    color: 290,
    tooltip: "Call a JavaScript function",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions",
    inputs: [
      { type: "row", children: [
        { type: "field_text", name: "NAME", default: "myFunction" },
        { type: "label", text: "(" },
        { type: "field_text", name: "ARGS", default: "arg1, arg2" },
        { type: "label", text: ")" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component", output: "js_value" },
    schema: {
      type: "object",
      title: "Function Call",
      description: "Call a JavaScript function with arguments",
      properties: {
        NAME: {
          type: "string",
          description: "Function name to call",
          default: "myFunction"
        },
        ARGS: {
          type: "string",
          description: "Comma-separated arguments",
          default: "arg1, arg2"
        }
      },
      required: ["NAME"]
    }
  },
  
  js_return: {
    type: 'js_return',
    category: 'variables',
    color: 290,
    tooltip: "Return a value from a function",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "return" },
        { type: "input_value", name: "VALUE" }
      ]}
    ],
    connections: { previous: "web_component" },
    schema: {
      type: "object",
      title: "Return Statement",
      description: "Return a value from a function",
      properties: {
        VALUE: {
          type: "string",
          description: "Value to return from the function"
        }
      },
      required: ["VALUE"]
    }
  },
  
  js_fetch: {
    type: 'js_fetch',
    category: 'variables',
    color: 290,
    tooltip: "Fetch data from an API",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API",
    inputs: [
      { type: "label", text: "Fetch Data" },
      { type: "row", children: [
        { type: "label", text: "URL" },
        { type: "field_text", name: "URL", default: "https://api.example.com/data" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Method" },
        { type: "field_dropdown", name: "METHOD", options: [
          ["GET", "GET"],
          ["POST", "POST"],
          ["PUT", "PUT"],
          ["DELETE", "DELETE"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Headers (JSON)" },
        { type: "field_multiline", name: "HEADERS", default: '{\n  "Content-Type": "application/json"\n}' }
      ]},
      { type: "row", children: [
        { type: "label", text: "Body (for POST/PUT)" },
        { type: "field_multiline", name: "BODY", default: '{\n  "name": "John",\n  "email": "john@example.com"\n}' }
      ]},
      { type: "row", children: [
        { type: "label", text: "Store result in" },
        { type: "field_text", name: "RESULT", default: "response" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Fetch Data",
      description: "Fetch data from an API endpoint",
      properties: {
        URL: {
          type: "string",
          description: "API endpoint URL",
          default: "https://api.example.com/data"
        },
        METHOD: {
          type: "string",
          description: "HTTP method",
          enum: ["GET", "POST", "PUT", "DELETE"],
          default: "GET"
        },
        HEADERS: {
          type: "string",
          description: "HTTP headers as JSON object",
          default: '{\n  "Content-Type": "application/json"\n}'
        },
        BODY: {
          type: "string",
          description: "Request body for POST/PUT requests",
          default: '{\n  "name": "John",\n  "email": "john@example.com"\n}'
        },
        RESULT: {
          type: "string",
          description: "Variable name to store the response",
          default: "response"
        }
      },
      required: ["URL", "METHOD", "RESULT"]
    }
  }
};

// Create and export the variable and function block definitions
export const variableDefinitions = createBlockDefinitions(variableBlockConfigs);

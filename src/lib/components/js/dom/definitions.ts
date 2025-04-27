import { createBlockDefinitions } from '$lib/utils/block-factory.js';
import type { WebBlockConfigs } from '$lib/types.js';
import { registerVisibilityExtension, initializeVisibilityExtensions } from '$lib/utils/blockly-extensions.js';
import * as Blockly from 'blockly/core';

// Register your extensions
registerVisibilityExtension(
  'dom_property_visibility',            // the name you'll refer to below
  {
    dropdownField: 'PROPERTY_TYPE',     // which dropdown drives it
    visibilityMap: {
      // Show PROPERTY field for ALL property types
      PROPERTY: ['attribute', 'style']
    }
  }
);

// Initialize extensions once Blockly is loaded
// This should be called after Blockly is fully initialized


// Define DOM manipulation block configurations
const jsDomBlockConfigs: WebBlockConfigs = {
  // Selection and reference
  js_select_element: {
    type: 'js_select_element',
    category: 'dom',
    color: 180,
    tooltip: "Select a DOM element and store it as a variable",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector",
    inputs: [
      { type: "label", text: "Select Element" },
      { type: "row", children: [
        { type: "label", text: "Selector" },
        { type: "field_text", name: "SELECTOR", default: "#element-id" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Store as" },
        { type: "field_text", name: "VARIABLE", default: "element" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Select Element",
      description: "Select a DOM element and store it as a variable",
      properties: {
        SELECTOR: {
          type: "string",
          description: "CSS selector to find the element",
          default: "#element-id"
        },
        VARIABLE: {
          type: "string",
          description: "Variable name to store the element",
          default: "element"
        }
      },
      required: ["SELECTOR", "VARIABLE"]
    }
  },
  
  // Unified property manipulation
  js_element_property: {
    type: 'js_element_property',
    category: 'dom',
    color: 180,
    tooltip: "Get or set an element's property, attribute, or style",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Element",
    inputs: [
      { type: "label", text: "Element Property" },
      { type: "row", children: [
        { type: "field_dropdown", name: "ACTION", options: [
          ["Set", "set"],
          ["Get", "get"]
        ]},
        { type: "label", text: "on element ID" },
        { type: "field_text", name: "ELEMENT", default: "document-1" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Property type" },
        { type: "field_dropdown", name: "PROPERTY_TYPE", options: [
          ["Text", "text"],
          ["HTML", "html"],
          ["Attribute", "attribute"],
          ["Style", "style"],
          ["Value (markdown or inputs)", "value"]
        ], default: "style"}
      ]},
      { type: "row", children: [
        { type: "label", text: "Property name" },
        { type: "field_text", name: "PROPERTY", default: "background-color" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Value (for set)" },
        { type: "field_text", name: "VALUE", default: "lightblue" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Use as expression" },
        { type: "field_checkbox", name: "IS_EXPRESSION", checked: false }
      ]},
      { type: "row", children: [
        { type: "label", text: "Logging level" },
        { type: "field_dropdown", name: "LOGGING_LEVEL", options: [
          ["None", "none"],
          ["Basic", "basic"],
          ["Detailed", "detailed"]
        ], default: "none"}
      ]}
    ],
    connections: { previous: "web_component", next: "web_component", output: "String" },
    extensions: ['dom_property_visibility'],
    schema: {
      type: "object",
      title: "Element Property",
      description: "Get or set an element's property, attribute, or style",
      properties: {
        ACTION: {
          type: "string",
          description: "Whether to get or set the property",
          enum: ["set", "get"],
          default: "set"
        },
        ELEMENT: {
          type: "string",
          description: "Element ID or variable name",
          default: "document-1"
        },
        PROPERTY_TYPE: {
          type: "string",
          description: "Type of property to manipulate",
          enum: ["text", "html", "attribute", "style", "value"],
          default: "style"
        },
        PROPERTY: {
          type: "string",
          description: "Name of the property or attribute",
          default: "background-color"
        },
        VALUE: {
          type: "string",
          description: "Value to set (for set action)",
          default: "lightblue"
        },
        IS_EXPRESSION: {
          type: "boolean",
          description: "Whether to evaluate the value as an expression",
          default: false
        },
        LOGGING_LEVEL: {
          type: "string",
          description: "Level of logging for this operation",
          enum: ["none", "basic", "detailed"],
          default: "none"
        }
      },
      required: ["ACTION", "ELEMENT", "PROPERTY_TYPE"]
    }
  },
  
  // Class manipulation
  js_element_class: {
    type: 'js_element_class',
    category: 'dom',
    color: 180,
    tooltip: "Add, remove, or toggle a class on an element",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Element/classList",
    inputs: [
      { type: "label", text: "Element Class" },
      { type: "row", children: [
        { type: "field_dropdown", name: "ACTION", options: [
          ["Add", "add"],
          ["Remove", "remove"],
          ["Toggle", "toggle"],
          ["Check", "contains"]
        ]},
        { type: "label", text: "class" }
      ]},
      { type: "row", children: [
        { type: "field_text", name: "CLASS", default: "active" },
        { type: "label", text: "on element" },
        { type: "field_text", name: "ELEMENT", default: "element" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component", output: "Strings" },
    schema: {
      type: "object",
      title: "Element Class",
      description: "Add, remove, or toggle a class on an element",
      properties: {
        ACTION: {
          type: "string",
          description: "Action to perform on the class",
          enum: ["add", "remove", "toggle", "contains"],
          default: "add"
        },
        CLASS: {
          type: "string",
          description: "CSS class name",
          default: "active"
        },
        ELEMENT: {
          type: "string",
          description: "Element ID or variable name",
          default: "element"
        }
      },
      required: ["ACTION", "CLASS", "ELEMENT"]
    }
  },
  
  // Event handling
  js_event_handler: {
    type: 'js_event_handler',
    category: 'dom',
    color: 180,
    tooltip: "Create an event handler for a DOM element",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener",
    inputs: [
      { type: "label", text: "Event Handler" },
      { type: "row", children: [
        { type: "label", text: "When element" },
        { type: "field_text", name: "ELEMENT", default: "element" }
      ]},
      { type: "row", children: [
        { type: "label", text: "receives event" },
        { type: "field_dropdown", name: "EVENT", options: [
          ["click", "click"],
          ["change", "change"],
          ["submit", "submit"],
          ["keyup", "keyup"],
          ["focus", "focus"],
          ["blur", "blur"],
          ["mouseenter", "mouseenter"],
          ["mouseleave", "mouseleave"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Prevent default" },
        { type: "field_checkbox", name: "PREVENT_DEFAULT", checked: false }
      ]},
      { type: "statement", name: "HANDLER", check: "web_component", label: "Do" }
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Event Handler",
      description: "Create an event handler for a DOM element",
      properties: {
        ELEMENT: {
          type: "string",
          description: "Element ID or variable name",
          default: "element"
        },
        EVENT: {
          type: "string",
          description: "Type of event to listen for",
          enum: ["click", "change", "submit", "keyup", "focus", "blur", "mouseenter", "mouseleave"],
          default: "click"
        },
        PREVENT_DEFAULT: {
          type: "boolean",
          description: "Whether to prevent the default action",
          default: false
        },
        HANDLER: {
          type: "array",
          description: "Blocks to execute when the event occurs",
          items: {
            type: "object"
          }
        }
      },
      required: ["ELEMENT", "EVENT"]
    }
  },
  
  // DOM tree manipulation
  js_tree_operation: {
    type: 'js_tree_operation',
    category: 'dom',
    color: 180,
    tooltip: "Perform operations on the DOM tree",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Node",
    inputs: [
      { type: "label", text: "DOM Tree Operation" },
      { type: "row", children: [
        { type: "field_dropdown", name: "ACTION", options: [
          ["Append", "append"],
          ["Prepend", "prepend"],
          ["Insert before", "before"],
          ["Replace", "replace"],
          ["Remove", "remove"]
        ]},
        { type: "label", text: "element" }
      ]},
      { type: "row", children: [
        { type: "field_text", name: "CHILD", default: "newElement" },
        { type: "label", text: "to/from" },
        { type: "field_text", name: "PARENT", default: "container" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "DOM Tree Operation",
      description: "Perform operations on the DOM tree",
      properties: {
        ACTION: {
          type: "string",
          description: "Type of tree operation to perform",
          enum: ["append", "prepend", "before", "replace", "remove"],
          default: "append"
        },
        CHILD: {
          type: "string",
          description: "Element to be operated on",
          default: "newElement"
        },
        PARENT: {
          type: "string",
          description: "Target element for the operation",
          default: "container"
        }
      },
      required: ["ACTION", "CHILD", "PARENT"]
    }
  },
  
  // Iterative data manipulation
  js_iterate_data: {
    type: 'js_iterate_data',
    category: 'dom',
    color: 180,
    tooltip: "Create DOM elements from an array of data",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach",
    inputs: [
      { type: "label", text: "Create Elements from Data" },
      { type: "row", children: [
        { type: "label", text: "Data source" },
        { type: "field_text", name: "DATA_SOURCE", default: "items" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Container" },
        { type: "field_text", name: "CONTAINER", default: "#item-list" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Element type" },
        { type: "field_dropdown", name: "ELEMENT_TYPE", options: [
          ["List item (li)", "li"],
          ["Div", "div"],
          ["Paragraph (p)", "p"],
          ["Table row (tr)", "tr"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Template" },
        { type: "field_text", name: "TEMPLATE", default: "${item.name}" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Create Elements from Data",
      description: "Create DOM elements from an array of data",
      properties: {
        DATA_SOURCE: {
          type: "string",
          description: "Variable name containing the data array",
          default: "items"
        },
        CONTAINER: {
          type: "string",
          description: "Selector for the container element",
          default: "#item-list"
        },
        ELEMENT_TYPE: {
          type: "string",
          description: "Type of element to create for each data item",
          enum: ["li", "div", "p", "tr"],
          default: "li"
        },
        TEMPLATE: {
          type: "string",
          description: "Template for element content with ${item} placeholders",
          default: "${item.name}"
        }
      },
      required: ["DATA_SOURCE", "CONTAINER", "ELEMENT_TYPE"]
    }
  },
  
  // Table population
  js_populate_table: {
    type: 'js_populate_table',
    category: 'dom',
    color: 180,
    tooltip: "Populate a table with data from an array",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement",
    inputs: [
      { type: "label", text: "Populate Table" },
      { type: "row", children: [
        { type: "label", text: "Data source" },
        { type: "field_text", name: "DATA_SOURCE", default: "users" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Table selector" },
        { type: "field_text", name: "TABLE", default: "#data-table" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Columns (comma separated)" },
        { type: "field_text", name: "COLUMNS", default: "name,email,role" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Include headers" },
        { type: "field_checkbox", name: "HEADERS", checked: true }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Populate Table",
      description: "Populate a table with data from an array",
      properties: {
        DATA_SOURCE: {
          type: "string",
          description: "Variable name containing the data array",
          default: "users"
        },
        TABLE: {
          type: "string",
          description: "Selector for the table element",
          default: "#data-table"
        },
        COLUMNS: {
          type: "string",
          description: "Comma-separated list of data columns to display",
          default: "name,email,role"
        },
        HEADERS: {
          type: "boolean",
          description: "Whether to include column headers",
          default: true
        }
      },
      required: ["DATA_SOURCE", "TABLE", "COLUMNS"]
    }
  },
  
  // Template-based element creation
  js_create_from_template: {
    type: 'js_create_from_template',
    category: 'dom',
    color: 180,
    tooltip: "Create elements from a template and data",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals",
    inputs: [
      { type: "label", text: "Create from Template" },
      { type: "row", children: [
        { type: "label", text: "Template" },
        { type: "field_multiline", name: "TEMPLATE", default: "<div class=\"item\">${item.name}</div>" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Data source" },
        { type: "field_text", name: "DATA_SOURCE", default: "items" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Container" },
        { type: "field_text", name: "CONTAINER", default: "#container" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Create from Template",
      description: "Create elements from a template and data",
      properties: {
        TEMPLATE: {
          type: "string",
          description: "HTML template with ${item} placeholders",
          default: "<div class=\"item\">${item.name}</div>"
        },
        DATA_SOURCE: {
          type: "string",
          description: "Variable name containing the data",
          default: "items"
        },
        CONTAINER: {
          type: "string",
          description: "Selector for the container element",
          default: "#container"
        }
      },
      required: ["TEMPLATE", "DATA_SOURCE", "CONTAINER"]
    }
  },
  
  // Element modification block
  js_modify_element: {
    type: 'js_modify_element',
    category: 'dom',
    color: 180,
    tooltip: "Modify an existing DOM element",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Element",
    inputs: [
      { type: "label", text: "Modify Element" },
      { type: "row", children: [
        { type: "label", text: "Element ID or variable" },
        { type: "field_text", name: "ELEMENT", default: "myElement" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Use as variable" },
        { type: "field_checkbox", name: "IS_VARIABLE", checked: false }
      ]},
      { type: "row", children: [
        { type: "label", text: "Action" },
        { type: "field_dropdown", name: "ACTION", options: [
          ["Set content", "content"],
          ["Set attribute", "attribute"],
          ["Set style", "style"],
          ["Clear", "clear"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Property/Name" },
        { type: "field_text", name: "PROPERTY", default: "innerHTML" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Value" },
        { type: "field_text", name: "VALUE", default: "New content" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Modify Element",
      description: "Modify an existing DOM element",
      properties: {
        ELEMENT: {
          type: "string",
          description: "Element ID or variable name",
          default: "myElement"
        },
        IS_VARIABLE: {
          type: "boolean",
          description: "Whether the element is a variable reference",
          default: false
        },
        ACTION: {
          type: "string",
          description: "Type of modification to perform",
          enum: ["content", "attribute", "style", "clear"],
          default: "content"
        },
        PROPERTY: {
          type: "string",
          description: "Property or attribute name to modify",
          default: "innerHTML"
        },
        VALUE: {
          type: "string",
          description: "Value to set",
          default: "New content"
        }
      },
      required: ["ELEMENT", "ACTION"]
    }
  },
  
  // Delete element block
  js_delete_element: {
    type: 'js_delete_element',
    category: 'dom',
    color: 180,
    tooltip: "Remove an element from the DOM",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Element/remove",
    inputs: [
      { type: "label", text: "Delete Element" },
      { type: "row", children: [
        { type: "label", text: "Element ID or variable" },
        { type: "field_text", name: "ELEMENT", default: "elementToDelete" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Use as variable" },
        { type: "field_checkbox", name: "IS_VARIABLE", checked: false }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Delete Element",
      description: "Remove an element from the DOM",
      properties: {
        ELEMENT: {
          type: "string",
          description: "Element ID or variable name to delete",
          default: "elementToDelete"
        },
        IS_VARIABLE: {
          type: "boolean",
          description: "Whether the element is a variable reference",
          default: false
        }
      },
      required: ["ELEMENT"]
    }
  },
  
  // Clone element block
  js_clone_element: {
    type: 'js_clone_element',
    category: 'dom',
    color: 180,
    tooltip: "Clone an existing DOM element",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode",
    inputs: [
      { type: "label", text: "Clone Element" },
      { type: "row", children: [
        { type: "label", text: "Element to clone" },
        { type: "field_text", name: "SOURCE", default: "sourceElement" }
      ]},
      { type: "row", children: [
        { type: "label", text: "New element ID" },
        { type: "field_text", name: "NEW_ID", default: "clonedElement" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Clone children" },
        { type: "field_checkbox", name: "DEEP", checked: true }
      ]},
      { type: "row", children: [
        { type: "label", text: "Add to container" },
        { type: "field_text", name: "CONTAINER", default: "parentElement" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Clone Element",
      description: "Clone an existing DOM element",
      properties: {
        SOURCE: {
          type: "string",
          description: "Element ID or variable name to clone",
          default: "sourceElement"
        },
        NEW_ID: {
          type: "string",
          description: "ID for the cloned element",
          default: "clonedElement"
        },
        DEEP: {
          type: "boolean",
          description: "Whether to clone child elements",
          default: true
        },
        CONTAINER: {
          type: "string",
          description: "Container to add the cloned element to",
          default: "parentElement"
        }
      },
      required: ["SOURCE", "NEW_ID", "CONTAINER"]
    }
  }
};


// Create and export the DOM block definitions
export const jsDomDefinitions = createBlockDefinitions(jsDomBlockConfigs);
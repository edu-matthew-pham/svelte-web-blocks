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
    connections: { previous: "web_component", next: "web_component" }
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
    extensions: ['dom_property_visibility']
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
    connections: { previous: "web_component", next: "web_component", output: "Strings" }
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
    connections: { previous: "web_component", next: "web_component" }
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
    connections: { previous: "web_component", next: "web_component" }
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
    connections: { previous: "web_component", next: "web_component" }
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
    connections: { previous: "web_component", next: "web_component" }
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
    connections: { previous: "web_component", next: "web_component" }
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
    connections: { previous: "web_component", next: "web_component" }
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
    connections: { previous: "web_component", next: "web_component" }
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
    connections: { previous: "web_component", next: "web_component" }
  }
};


// Create and export the DOM block definitions
export const jsDomDefinitions = createBlockDefinitions(jsDomBlockConfigs);
import { createBlockDefinitions } from '$lib/utils/block-factory.js';
import type { WebBlockConfigs } from '$lib/types.js';
import { registerVisibilityExtension, initializeVisibilityExtensions } from '$lib/utils/blockly-extensions.js';
import * as Blockly from 'blockly/core';

// Define DOM creation block configurations
const jsCreateBlockConfigs: WebBlockConfigs = {
  // Container Elements (div, section, form, etc.)
  js_create_container: {
    type: 'js_create_container',
    category: 'create',
    color: 160,
    tooltip: "Create a container element like div, section, or form",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Create Container" },
        { type: "label", text: "ID (required)" },
        { type: "field_text", name: "ID", default: "myContainer" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Class" },
        { type: "field_text", name: "CLASS", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Type" },
        { type: "field_dropdown", name: "TAG", options: [
          ["div", "div"],
          ["section", "section"],
          ["article", "article"],
          ["form", "form"],
          ["header", "header"],
          ["footer", "footer"],
          ["main", "main"],
          ["aside", "aside"],
          ["nav", "nav"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Add to" },
        { type: "field_text", name: "CONTAINER", default: "document-1" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Initial content" },
        { type: "field_dropdown", name: "CONTENT_TYPE", options: [
          ["HTML", "html"],
          ["Text", "text"],
          ["Empty", "empty"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Content" },
        { type: "field_multiline", name: "CONTENT", default: "" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Create Container",
      description: "Create a container element like div, section, or form",
      properties: {
        ID: {
          type: "string",
          description: "Container identifier (required)",
          default: "myContainer"
        },
        CLASS: {
          type: "string",
          description: "CSS classes to apply"
        },
        TAG: {
          type: "string",
          description: "Type of container element",
          enum: ["div", "section", "article", "form", "header", "footer", "main", "aside", "nav"],
          default: "div"
        },
        CONTAINER: {
          type: "string",
          description: "Parent element to add this container to",
          default: "document-1"
        },
        CONTENT_TYPE: {
          type: "string",
          description: "Type of initial content",
          enum: ["html", "text", "empty"],
          default: "empty"
        },
        CONTENT: {
          type: "string",
          description: "Initial content for the container"
        }
      },
      required: ["ID", "TAG", "CONTAINER"]
    }
  },
  
  // Interactive Elements (button, input, img, etc.)
  js_create_interactive: {
    type: 'js_create_interactive',
    category: 'create',
    color: 160,
    tooltip: "Create interactive elements like buttons, inputs, and images",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Create Interactive Element" },
        { type: "label", text: "ID (optional)" },
        { type: "field_text", name: "ID", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Class" },
        { type: "field_text", name: "CLASS", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Type" },
        { type: "field_dropdown", name: "TAG", options: [
          ["Button", "button"],
          ["Text Input", "input[text]"],
          ["Checkbox", "input[checkbox]"],
          ["Radio", "input[radio]"],
          ["Image", "img"],
          ["File Upload", "input[file]"],
          ["Slider", "input[range]"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Label/Text" },
        { type: "field_text", name: "LABEL", default: "Click me" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Add to" },
        { type: "field_text", name: "CONTAINER", default: "document-1" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Attributes (JSON)" },
        { type: "field_multiline", name: "ATTRIBUTES", default: '{"placeholder": "Enter text"}' }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Create Interactive Element",
      description: "Create interactive elements like buttons, inputs, and images",
      properties: {
        ID: {
          type: "string",
          description: "Element identifier (optional)"
        },
        CLASS: {
          type: "string",
          description: "CSS classes to apply"
        },
        TAG: {
          type: "string",
          description: "Type of interactive element",
          enum: ["button", "input[text]", "input[checkbox]", "input[radio]", "img", "input[file]", "input[range]"],
          default: "button"
        },
        LABEL: {
          type: "string",
          description: "Label or text content for the element",
          default: "Click me"
        },
        CONTAINER: {
          type: "string",
          description: "Parent element to add this element to",
          default: "document-1"
        },
        ATTRIBUTES: {
          type: "string",
          description: "JSON object of additional attributes",
          default: '{"placeholder": "Enter text"}'
        }
      },
      required: ["TAG", "CONTAINER"]
    }
  },
  
  // Text Elements (headings, paragraphs, links, etc.)
  js_create_text: {
    type: 'js_create_text',
    category: 'create',
    color: 160,
    tooltip: "Create text elements like headings, paragraphs, and links",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Create Text" },
        { type: "label", text: "ID (optional)" },
        { type: "field_text", name: "ID", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Class" },
        { type: "field_text", name: "CLASS", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Type" },
        { type: "field_dropdown", name: "TAG", options: [
          ["Heading 1", "h1"],
          ["Heading 2", "h2"],
          ["Heading 3", "h3"],
          ["Paragraph", "p"],
          ["Link", "a"],
          ["Span", "span"],
          ["Strong/Bold", "strong"],
          ["Emphasis/Italic", "em"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Content" },
        { type: "field_multiline", name: "CONTENT", default: "Text content here" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Add to" },
        { type: "field_text", name: "CONTAINER", default: "document-1" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Link URL (for links)" },
        { type: "field_text", name: "HREF", default: "" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Create Text Element",
      description: "Create text elements like headings, paragraphs, and links",
      properties: {
        ID: {
          type: "string",
          description: "Element identifier (optional)"
        },
        CLASS: {
          type: "string",
          description: "CSS classes to apply"
        },
        TAG: {
          type: "string",
          description: "Type of text element",
          enum: ["h1", "h2", "h3", "p", "a", "span", "strong", "em"],
          default: "p"
        },
        CONTENT: {
          type: "string",
          description: "Text content for the element",
          default: "Text content here"
        },
        CONTAINER: {
          type: "string",
          description: "Parent element to add this element to",
          default: "document-1"
        },
        HREF: {
          type: "string",
          description: "URL for link elements"
        }
      },
      required: ["TAG", "CONTENT", "CONTAINER"]
    }
  },
  
  // Hierarchical/Data Elements (tables, lists, etc.)
  js_create_structured: {
    type: 'js_create_structured',
    category: 'create',
    color: 160,
    tooltip: "Create structured elements like tables and lists",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Create Structure" },
        { type: "label", text: "ID (required)" },
        { type: "field_text", name: "ID", default: "myList" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Class" },
        { type: "field_text", name: "CLASS", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Type" },
        { type: "field_dropdown", name: "STRUCTURE_TYPE", options: [
          ["Unordered List", "ul"],
          ["Ordered List", "ol"],
          ["Table", "table"],
          ["Definition List", "dl"],
          ["Select Dropdown", "select"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Add to" },
        { type: "field_text", name: "CONTAINER", default: "document-1" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Data source (optional)" },
        { type: "field_text", name: "DATA_SOURCE", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Manual items (CSV)" },
        { type: "field_multiline", name: "ITEMS", default: "Item 1, Item 2, Item 3" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Create Structured Element",
      description: "Create structured elements like tables and lists",
      properties: {
        ID: {
          type: "string",
          description: "Element identifier (required)",
          default: "myList"
        },
        CLASS: {
          type: "string",
          description: "CSS classes to apply"
        },
        STRUCTURE_TYPE: {
          type: "string",
          description: "Type of structured element",
          enum: ["ul", "ol", "table", "dl", "select"],
          default: "ul"
        },
        CONTAINER: {
          type: "string",
          description: "Parent element to add this element to",
          default: "document-1"
        },
        DATA_SOURCE: {
          type: "string",
          description: "Variable name containing data (optional)"
        },
        ITEMS: {
          type: "string",
          description: "Comma-separated list of manual items",
          default: "Item 1, Item 2, Item 3"
        }
      },
      required: ["ID", "STRUCTURE_TYPE", "CONTAINER"]
    }
  },
  
  // Tree operation
  js_tree_operation: {
    type: 'js_tree_operation',
    category: 'create',
    color: 160,
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
          description: "Type of DOM tree operation",
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
    category: 'create',
    color: 160,
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
    category: 'create',
    color: 160,
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
    category: 'create',
    color: 160,
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
  
  // Structured Item Creation
  js_create_structured_item: {
    type: 'js_create_structured_item',
    category: 'create',
    color: 160,
    tooltip: "Create items for structured elements like lists and tables",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Create Structured Item" },
        { type: "label", text: "ID (optional)" },
        { type: "field_text", name: "ID", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Class" },
        { type: "field_text", name: "CLASS", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Type" },
        { type: "field_dropdown", name: "ITEM_TYPE", options: [
          ["List Item (li)", "li"],
          ["Table Row (tr)", "tr"],
          ["Table Cell (td)", "td"],
          ["Table Header (th)", "th"],
          ["Definition Term (dt)", "dt"],
          ["Definition Description (dd)", "dd"],
          ["Option (option)", "option"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Add to" },
        { type: "field_text", name: "CONTAINER", default: "myList" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Content type" },
        { type: "field_dropdown", name: "CONTENT_TYPE", options: [
          ["Single item", "single"],
          ["Multiple items", "multiple"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Content/Item" },
        { type: "field_multiline", name: "CONTENT", default: "Item content" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Option values (for options)" },
        { type: "field_multiline", name: "OPTION_VALUES", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Items separator" },
        { type: "field_dropdown", name: "SEPARATOR", options: [
          ["Comma (,)", ","],
          ["New line", "\n"],
          ["Semicolon (;)", ";"],
          ["Tab", "\t"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Attributes (JSON)" },
        { type: "field_multiline", name: "ATTRIBUTES", default: "{}" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Create Structured Item",
      description: "Create items for structured elements like lists and tables",
      properties: {
        ID: {
          type: "string",
          description: "Item identifier (optional)"
        },
        CLASS: {
          type: "string",
          description: "CSS classes to apply"
        },
        ITEM_TYPE: {
          type: "string",
          description: "Type of structured item",
          enum: ["li", "tr", "td", "th", "dt", "dd", "option"],
          default: "li"
        },
        CONTAINER: {
          type: "string",
          description: "Parent element to add this item to",
          default: "myList"
        },
        CONTENT_TYPE: {
          type: "string",
          description: "Whether to create single or multiple items",
          enum: ["single", "multiple"],
          default: "single"
        },
        CONTENT: {
          type: "string",
          description: "Content for the item(s)",
          default: "Item content"
        },
        OPTION_VALUES: {
          type: "string",
          description: "Values for option elements (for select dropdowns)"
        },
        SEPARATOR: {
          type: "string",
          description: "Separator for multiple items",
          enum: [",", "\n", ";", "\t"],
          default: ","
        },
        ATTRIBUTES: {
          type: "string",
          description: "JSON object of additional attributes",
          default: "{}"
        }
      },
      required: ["ITEM_TYPE", "CONTAINER", "CONTENT"]
    }
  }
};

// Create and export the DOM creation block definitions
export const jsCreateDefinitions = createBlockDefinitions(jsCreateBlockConfigs);

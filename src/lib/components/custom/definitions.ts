import { createBlockDefinitions } from '$lib/utils/block-factory.js';
import type { WebBlockConfigs } from '$lib/types.js';

// Define custom code block configurations
const customBlockConfigs: WebBlockConfigs = {
  web_custom_html: {
    type: 'web_custom_html',
    category: 'component',
    color: 230, // Blue color for HTML
    tooltip: "Add custom HTML code",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    inputs: [
      { 
        type: "combined_input", 
        fields: [
          { type: "label", text: "Custom HTML" },
          { type: "label", text: "ID:" },
          { type: "field_text", name: "ID", default: "" }
        ]
      },
      { 
        type: "field_text", 
        name: "CLASS",
        label: "Classes",
        default: "" 
      },
      { type: "row", children: [
        { type: "label", text: "HTML Code" },
        { type: "field_multiline", name: "CODE", default: "<!-- Add your custom HTML here -->\n<div class=\"custom-element\">\n  <h2>Custom Element</h2>\n  <p>This is custom HTML content.</p>\n</div>" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Custom HTML",
      description: "A block of custom HTML code",
      properties: {
        ID: {
          type: "string",
          description: "HTML block identifier"
        },
        CLASS: {
          type: "string",
          description: "CSS classes to apply to wrapper (if any)"
        },
        CODE: {
          type: "string",
          description: "Raw HTML code",
          default: "<!-- Add your custom HTML here -->\n<div class=\"custom-element\">\n  <h2>Custom Element</h2>\n  <p>This is custom HTML content.</p>\n</div>"
        }
      },
      required: ["CODE"]
    }
  },
  
  web_custom_css: {
    type: 'web_custom_css',
    category: 'component',
    color: 160, // Green color for CSS
    tooltip: "Add custom CSS styles",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    inputs: [
      { 
        type: "combined_input", 
        fields: [
          { type: "label", text: "Custom CSS" }
        ]
      },
      { type: "row", children: [
        { type: "label", text: "CSS Code" },
        { type: "field_multiline", name: "CODE", default: "/* Add your custom CSS here */\n.custom-element {\n  background-color: #f5f5f5;\n  padding: 15px;\n  border-radius: 5px;\n}\n\n.custom-element h2 {\n  color: #333;\n}" }
      ]}
    ],
    connections: { previous: "css_selector", next: "css_selector" },
    schema: {
      type: "object",
      title: "Custom CSS",
      description: "A block of custom CSS code",
      properties: {
        CODE: {
          type: "string",
          description: "Raw CSS code",
          default: "/* Add your custom CSS here */\n.custom-element {\n  background-color: #f5f5f5;\n  padding: 15px;\n  border-radius: 5px;\n}"
        }
      },
      required: ["CODE"]
    }
  },
  
  web_custom_js: {
    type: 'web_custom_js',
    category: 'component',
    color: 330, // Magenta/purple color for JavaScript
    tooltip: "Add custom JavaScript code",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    inputs: [
      { 
        type: "combined_input", 
        fields: [
          { type: "label", text: "Custom JavaScript" }
        ]
      },
      { type: "row", children: [
        { type: "label", text: "JavaScript Code" },
        { type: "field_multiline", name: "CODE", default: "// Add your custom JavaScript here\nfunction customFunction() {\n  console.log('Custom function executed');\n  \n  // Example: select an element and modify it\n  const element = document.querySelector('.custom-element');\n  if (element) {\n    element.addEventListener('click', function() {\n      alert('Custom element clicked!');\n    });\n  }\n}" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Custom JavaScript",
      description: "A block of custom JavaScript code",
      properties: {
        CODE: {
          type: "string",
          description: "Raw JavaScript code",
          default: "// Add your custom JavaScript here\nfunction customFunction() {\n  console.log('Custom function executed');\n}"
        }
      },
      required: ["CODE"]
    }
  }
};

// Create and export the custom block definitions
export const customDefinitions = createBlockDefinitions(customBlockConfigs);

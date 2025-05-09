import { createBlockDefinitions } from '$lib/utils/block-factory.js';
import type { WebBlockConfigs } from '$lib/types.js';

// Define custom code block configurations
const customBlockConfigs: WebBlockConfigs = {
  custom_content_html: {
    type: 'custom_content_html',
    category: 'component',
    color: 230, // Blue color for HTML
    tooltip: "Add custom HTML to the document body",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    inputs: [
      { 
        type: "combined_input", 
        fields: [
          { type: "label", text: "Custom Content HTML" },
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
        { type: "field_multiline", name: "CODE", default: "<!-- Add custom HTML to the body content -->\n<div class=\"custom-element\">\n  <h2>Custom Element</h2>\n  <p>This is custom HTML content.</p>\n</div>" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Custom Content HTML",
      description: "Custom HTML code for the document body",
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
          default: "<!-- Add custom HTML to the body content -->\n<div class=\"custom-element\">\n  <h2>Custom Element</h2>\n  <p>This is custom HTML content.</p>\n</div>"
        }
      },
      required: ["CODE"]
    }
  },
  
  custom_style_css: {
    type: 'custom_style_css',
    category: 'component',
    color: 160, // Green color for CSS
    tooltip: "Add custom CSS styles to the document",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    inputs: [
      { 
        type: "combined_input", 
        fields: [
          { type: "label", text: "Custom Styles CSS" }
        ]
      },
      { type: "row", children: [
        { type: "label", text: "CSS Code" },
        { type: "field_multiline", name: "CODE", default: "/* Add custom CSS styles */\n.custom-element {\n  background-color: #f5f5f5;\n  padding: 15px;\n  border-radius: 5px;\n}\n\n.custom-element h2 {\n  color: #333;\n}" }
      ]}
    ],
    connections: { previous: "css_selector", next: "css_selector" },
    schema: {
      type: "object",
      title: "Custom CSS Styles",
      description: "Custom CSS code for the STYLES section",
      properties: {
        CODE: {
          type: "string",
          description: "Raw CSS code",
          default: "/* Add custom CSS styles */\n.custom-element {\n  background-color: #f5f5f5;\n  padding: 15px;\n  border-radius: 5px;\n}"
        }
      },
      required: ["CODE"]
    }
  },
  
  custom_script_js: {
    type: 'custom_script_js',
    category: 'component',
    color: 330, // Magenta/purple color for JavaScript
    tooltip: "Add custom JavaScript to the document",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    inputs: [
      { 
        type: "combined_input", 
        fields: [
          { type: "label", text: "Custom Script JavaScript" }
        ]
      },
      { type: "row", children: [
        { type: "label", text: "JavaScript Code" },
        { type: "field_multiline", name: "CODE", default: "// Add general JavaScript code\nfunction customFunction() {\n  console.log('Custom function executed');\n  \n  // Example: select an element and modify it\n  const element = document.querySelector('.custom-element');\n  if (element) {\n    element.addEventListener('click', function() {\n      alert('Custom element clicked!');\n    });\n  }\n}" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Custom JavaScript",
      description: "Custom JavaScript code for the SCRIPTS section",
      properties: {
        CODE: {
          type: "string",
          description: "Raw JavaScript code",
          default: "// Add general JavaScript code\nfunction customFunction() {\n  console.log('Custom function executed');\n}"
        }
      },
      required: ["CODE"]
    }
  },
  
  custom_onload_js: {
    type: 'custom_onload_js',
    category: 'component',
    color: 330, // Magenta/purple color for JavaScript
    tooltip: "Add custom JavaScript that runs when the document loads",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event",
    inputs: [
      { 
        type: "combined_input", 
        fields: [
          { type: "label", text: "OnLoad JavaScript" }
        ]
      },
      { type: "row", children: [
        { type: "label", text: "JavaScript Code" },
        { type: "field_multiline", name: "CODE", default: "// This code runs when the document is fully loaded\nconsole.log('Document ready!');\n\n// Initialize your application\ncustomFunction();\n\n// Setup event listeners\ndocument.getElementById('my-button')?.addEventListener('click', function() {\n  // Button click handler\n});" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "OnLoad JavaScript",
      description: "Custom JavaScript that runs when the document is fully loaded",
      properties: {
        CODE: {
          type: "string",
          description: "JavaScript code to run on document load",
          default: "// This code runs when the document is fully loaded\nconsole.log('Document ready!');\n\n// Initialize your application\ncustomFunction();"
        }
      },
      required: ["CODE"]
    }
  }
};

// Create and export the custom block definitions
export const customDefinitions = createBlockDefinitions(customBlockConfigs);

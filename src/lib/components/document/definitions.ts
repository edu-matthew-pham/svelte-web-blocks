import type { BlockConfig } from '$lib/types.js';
import { createBlockDefinitions } from '$lib/utils/block-factory.js';

// Document block configurations
const documentBlocks: Record<string, BlockConfig> = {
  web_document: {
    type: 'web_document',
    category: 'component',
    color: 290,
    tooltip: "Create a complete webpage with Bootstrap included",
    helpUrl: "https://getbootstrap.com/",
    inputs: [
      { 
        type: "combined_input", 
        fields: [
          { type: "label", text: "Web Document" },
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
      { 
        type: "field_text", 
        name: "TITLE", 
        default: "My Web Page" 
      },
      {
        type: "field_dropdown",
        name: "THEME",
        options: [
          ["Light", "light"], 
          ["Dark", "dark"],
          ["Cerulean", "cerulean"],
          ["Cosmo", "cosmo"],
          ["Flatly", "flatly"],
          ["Journal", "journal"],
          ["Litera", "litera"],
          ["Lumen", "lumen"],
          ["Minty", "minty"],
          ["Pulse", "pulse"],
          ["Sandstone", "sandstone"],
          ["Simplex", "simplex"],
          ["Sketchy", "sketchy"],
          ["Spacelab", "spacelab"],
          ["United", "united"],
          ["Zephyr", "zephyr"]
        ]
      },
      {
        type: "row", 
        children: [
          { type: "label", text: "Use Bootstrap" },
          { type: "field_checkbox", name: "USE_BOOTSTRAP", checked: true }
        ]
      },
      {
        type: "statement",
        name: "STYLES",
        label: "Styles",
        check: "css_selector"
      },
      {
        type: "statement",
        name: "CONTENT",
        label: "Content",
        check: "web_component"
      },
      {
        type: "statement",
        name: "SCRIPTS",
        label: "Scripts",
        check: "web_component"
      },
      {
        type: "statement", 
        name: "ONLOAD",
        label: "On Page Load",
        check: "web_component"
      },
      { 
        type: "field_text", 
        name: "COLLAPSE_TEXT",
        label: "Collapsed View Text",
        default: "Document: My Web Page" 
      }
    ],
    connections: {
      previous: false,
      next: false
    },
    schema: {
      type: "object",
      title: "Web Document",
      description: "Create a complete webpage with Bootstrap included",
      properties: {
        ID: {
          type: "string",
          description: "Document identifier"
        },
        CLASS: {
          type: "string",
          description: "CSS classes to apply"
        },
        TITLE: {
          type: "string",
          description: "Page title",
          default: "My Web Page"
        },
        THEME: {
          type: "string",
          description: "Bootstrap theme",
          enum: ["light", "dark", "cerulean", "cosmo", "flatly", "journal", "litera", 
                 "lumen", "minty", "pulse", "sandstone", "simplex", "sketchy", 
                 "spacelab", "united", "zephyr"]
        },
        USE_BOOTSTRAP: {
          type: "boolean",
          description: "Whether to use Bootstrap framework or raw HTML",
          default: true
        },
        COLLAPSE_TEXT: {
          type: "field_hidden",
          description: "Text to display when block is collapsed",
          default: "Document: My Web Page"
        }
      },
      required: ["TITLE", "THEME"]
    },
    extensions: ['custom_collapsed_text_extension']
  }
};

// Create block definitions using the factory
export const documentDefinitions = createBlockDefinitions(documentBlocks);

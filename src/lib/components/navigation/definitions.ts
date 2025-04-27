import { createBlockDefinitions } from '$lib/utils/block-factory.js';
import type { WebBlockConfigs } from '$lib/types.js';

// Define navigation block configurations
const navigationBlockConfigs: WebBlockConfigs = {
  web_header: {
    type: 'web_header',
    category: 'document',
    color: 230,
    tooltip: "Add a page header with navigation",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header",
    inputs: [
      { 
        type: "combined_input", 
        fields: [
          { type: "label", text: "Header" },
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
      { type: "field_text", name: "LOGO_TEXT", default: "My Website" },
      { type: "row", children: [
        { type: "label", text: "Include Sign-up Button" },
        { type: "field_checkbox", name: "INCLUDE_SIGNUP", checked: true }
      ]},
      { type: "statement", name: "LINKS", check: "web_nav_item", label: "Navigation links" }
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Header",
      description: "A page header with navigation menu",
      properties: {
        ID: {
          type: "string",
          description: "Header identifier"
        },
        CLASS: {
          type: "string",
          description: "CSS classes to apply"
        },
        LOGO_TEXT: {
          type: "string",
          description: "Text for the website logo/brand",
          default: "My Website"
        },
        INCLUDE_SIGNUP: {
          type: "boolean",
          description: "Whether to include a sign-up button",
          default: true
        },
        LINKS: {
          type: "array",
          description: "Navigation links in the header",
          items: {
            type: "object",
            $ref: "#/definitions/web_nav_item"
          }
        }
      },
      required: ["LOGO_TEXT"]
    }
  },
  
  web_nav_item: {
    type: 'web_nav_item',
    category: 'item',
    color: 230,
    tooltip: "Add a navigation link",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a",
    inputs: [
      { 
        type: "combined_input", 
        fields: [
          { type: "label", text: "Link" },
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
      { type: "field_text", name: "TEXT", default: "Home" },
      { type: "field_text", name: "URL", default: "#" }
    ],
    connections: { previous: "web_nav_item", next: "web_nav_item" },
    schema: {
      type: "object",
      title: "Navigation Item",
      description: "A navigation link in the header",
      properties: {
        ID: {
          type: "string",
          description: "Link identifier"
        },
        CLASS: {
          type: "string",
          description: "CSS classes to apply"
        },
        TEXT: {
          type: "string",
          description: "Link text",
          default: "Home"
        },
        URL: {
          type: "string",
          description: "Link URL",
          default: "#"
        }
      },
      required: ["TEXT", "URL"]
    }
  }
};

// Create and export the navigation block definitions
export const navigationDefinitions = createBlockDefinitions(navigationBlockConfigs); 
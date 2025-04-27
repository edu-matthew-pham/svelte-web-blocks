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
    connections: { previous: "web_component", next: "web_component" }
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
    connections: { previous: "web_nav_item", next: "web_nav_item" }
  }
};

// Create and export the navigation block definitions
export const navigationDefinitions = createBlockDefinitions(navigationBlockConfigs); 
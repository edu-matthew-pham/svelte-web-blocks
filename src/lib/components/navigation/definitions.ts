import type { WebBlockDefinitions } from '$lib/types.js';
import { createBlockDefinition } from '$lib/utils/block-factory.js';

// Navigation block definitions
export const navigationDefinitions: WebBlockDefinitions = {
  // Header block definition
  web_header: createBlockDefinition({
    color: 230,
    tooltip: "Create a website header with navigation",
    helpUrl: "https://getbootstrap.com/docs/5.3/components/navbar/",
    inputs: [
      {
        type: 'dummy',
        fields: [
          { type: 'label', text: "Header" }
        ]
      },
      {
        type: 'dummy',
        fields: [
          { type: 'label', text: "Logo Text" },
          { type: 'text', name: "LOGO_TEXT", default: "My Website" }
        ]
      },
      {
        type: 'dummy',
        fields: [
          { type: 'label', text: "Include Signup" },
          { type: 'checkbox', name: "INCLUDE_SIGNUP", default: true }
        ]
      },
      {
        type: 'statement',
        name: "LINKS",
        check: "nav_item",
        fields: [
          { type: 'label', text: "Navigation Links" }
        ]
      }
    ],
    connections: {
      previous: true,
      next: true
    },
    outputType: "web_component"
  }),
  
  // Navigation item block definition
  web_nav_item: createBlockDefinition({
    color: 230,
    tooltip: "Add a navigation link",
    helpUrl: "https://getbootstrap.com/docs/5.3/components/navbar/",
    inputs: [
      {
        type: 'dummy',
        fields: [
          { type: 'label', text: "Navigation Link" }
        ]
      },
      {
        type: 'dummy',
        fields: [
          { type: 'label', text: "Text" },
          { type: 'text', name: "TEXT", default: "Home" }
        ]
      },
      {
        type: 'dummy',
        fields: [
          { type: 'label', text: "URL" },
          { type: 'text', name: "URL", default: "index.html" }
        ]
      }
    ],
    connections: {
      previous: true,
      next: true
    },
    outputType: "nav_item"
  })
}; 
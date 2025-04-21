import type { WebBlockDefinitions } from '$lib/types.js';
import { createBlockDefinition } from '$lib/utils/block-factory.js';

// Document block definitions using the factory
export const documentDefinitions: WebBlockDefinitions = {
  web_document: createBlockDefinition({
    color: 290,
    tooltip: "Create a complete webpage with Bootstrap included",
    helpUrl: "https://getbootstrap.com/",
    inputs: [
      {
        type: 'dummy',
        fields: [
          { type: 'label', text: "Web Document" }
        ]
      },
      {
        type: 'dummy',
        fields: [
          { type: 'label', text: "Title" },
          { type: 'text', name: "TITLE", default: "My Web Page" }
        ]
      },
      {
        type: 'dummy',
        fields: [
          { type: 'label', text: "Theme" },
          { 
            type: 'dropdown', 
            name: "THEME", 
            options: [
              ["Light", "light"],
              ["Dark", "dark"]
              // ...other themes
            ]
          }
        ]
      },
      {
        type: 'statement',
        name: "CONTENT",
        check: "web_component",
        fields: [
          { type: 'label', text: "Content" }
        ]
      }
    ],
    connections: {
      previous: false,
      next: false
    }
  })
}; 
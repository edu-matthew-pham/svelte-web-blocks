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
      { type: "label", text: "Web Document" },
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
      }
    ],
    connections: {
      previous: false,
      next: false
    }
  }
};

// Create block definitions using the factory
export const documentDefinitions = createBlockDefinitions(documentBlocks); 
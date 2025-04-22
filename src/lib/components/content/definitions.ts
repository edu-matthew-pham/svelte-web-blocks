import { createBlockDefinitions } from '$lib/utils/block-factory.js';
import type { WebBlockConfigs } from '$lib/types.js';

// Define content block configurations
const contentBlockConfigs: WebBlockConfigs = {
  web_content_section: {
    type: 'web_content_section',
    category: 'component',
    color: 120,
    tooltip: "Add a content section with headline and text",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section",
    inputs: [
      { 
        type: "combined_input", 
        fields: [
          { type: "label", text: "Content Section" },
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
        { type: "label", text: "Headline" },
        { type: "field_text", name: "HEADLINE", default: "Section Title" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Columns" },
        { type: "field_dropdown", name: "COLUMNS", options: [
          ["One column", "1"], 
          ["Two columns", "2"], 
          ["Three columns", "3"]
        ]}
      ]},
      { type: "statement", name: "CONTENT_BLOCKS", check: "web_content_block", label: "Content Blocks" }
    ],
    connections: { previous: "web_component", next: "web_component" }
  },
  
  web_content_block: {
    type: 'web_content_block',
    category: 'item',
    color: 120,
    tooltip: "Add markdown-formatted content to a section",
    helpUrl: "https://www.markdownguide.org/basic-syntax/",
    inputs: [
      { 
        type: "combined_input", 
        fields: [
          { type: "label", text: "Content Block (Markdown supported)" },
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
        { type: "label", text: "Content" },
        { type: "field_multiline", name: "CONTENT", default: "# Heading\n\nAdd your **formatted** content here.\n\n- Bullet point\n- Another point\n\n[Link text](https://example.com)" }
      ]}
    ],
    connections: { previous: "web_content_block", next: "web_content_block" }
  }
};

// Create and export the content block definitions
export const contentDefinitions = createBlockDefinitions(contentBlockConfigs);

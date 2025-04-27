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
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Content Section",
      description: "A section with headline and formatted content blocks",
      properties: {
        ID: {
          type: "string",
          description: "Content section identifier"
        },
        CLASS: {
          type: "string",
          description: "CSS classes to apply"
        },
        HEADLINE: {
          type: "string",
          description: "Section headline text",
          default: "Section Title"
        },
        COLUMNS: {
          type: "string",
          description: "Number of columns for content layout",
          enum: ["1", "2", "3"],
          default: "1"
        },
        CONTENT_BLOCKS: {
          type: "array",
          description: "Content blocks contained in this section",
          items: {
            type: "object",
            $ref: "#/definitions/web_content_block"
          }
        }
      },
      required: ["HEADLINE", "COLUMNS"]
    }
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
    connections: { previous: "web_content_block", next: "web_content_block" },
    schema: {
      type: "object",
      title: "Content Block",
      description: "A block of markdown-formatted content",
      properties: {
        ID: {
          type: "string",
          description: "Content block identifier"
        },
        CLASS: {
          type: "string",
          description: "CSS classes to apply"
        },
        CONTENT: {
          type: "string",
          description: "Markdown-formatted content",
          default: "# Heading\n\nAdd your **formatted** content here.\n\n- Bullet point\n- Another point\n\n[Link text](https://example.com)"
        }
      },
      required: ["CONTENT"]
    }
  }
};

// Create and export the content block definitions
export const contentDefinitions = createBlockDefinitions(contentBlockConfigs);

import { createBlockDefinitions } from '$lib/utils/block-factory.js';
import type { WebBlockConfigs } from '$lib/types.js';

// Define footer block configurations
const footerBlockConfigs: WebBlockConfigs = {
  web_footer: {
    type: 'web_footer',
    category: 'component',
    color: 330,
    tooltip: "Add a page footer with links and copyright",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer",
    inputs: [
      { 
        type: "combined_input", 
        fields: [
          { type: "label", text: "Footer" },
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
        { type: "label", text: "Copyright" },
        { type: "field_text", name: "COPYRIGHT", default: "© 2023 My Company" }
      ]},
      { type: "statement", name: "LINKS", check: "web_footer_link", label: "Footer Links" }
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Footer",
      description: "A page footer with links and copyright information",
      properties: {
        ID: {
          type: "string",
          description: "Footer identifier"
        },
        CLASS: {
          type: "string",
          description: "CSS classes to apply"
        },
        COPYRIGHT: {
          type: "string",
          description: "Copyright text",
          default: "© 2023 My Company"
        },
        LINKS: {
          type: "array",
          description: "Links displayed in the footer",
          items: {
            type: "object",
            $ref: "#/definitions/web_footer_link"
          }
        }
      },
      required: ["COPYRIGHT"]
    }
  },
  
  web_footer_link: {
    type: 'web_footer_link',
    category: 'item',
    color: 330,
    tooltip: "Add a link to the footer",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a",
    inputs: [
      { 
        type: "combined_input", 
        fields: [
          { type: "label", text: "Footer Link" },
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
        { type: "label", text: "Text" },
        { type: "field_text", name: "TEXT", default: "Privacy Policy" }
      ]},
      { type: "row", children: [
        { type: "label", text: "URL" },
        { type: "field_text", name: "URL", default: "/privacy" }
      ]}
    ],
    connections: { previous: "web_footer_link", next: "web_footer_link" },
    schema: {
      type: "object",
      title: "Footer Link",
      description: "A link displayed in the footer",
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
          default: "Privacy Policy"
        },
        URL: {
          type: "string",
          description: "Link URL",
          default: "/privacy"
        }
      },
      required: ["TEXT", "URL"]
    }
  }
};

// Create and export the footer block definitions
export const footerDefinitions = createBlockDefinitions(footerBlockConfigs);

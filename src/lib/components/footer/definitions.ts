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
      { type: "label", text: "Footer" },
      { type: "row", children: [
        { type: "label", text: "Copyright" },
        { type: "field_text", name: "COPYRIGHT", default: "© 2023 My Company" }
      ]},
      { type: "statement", name: "LINKS", check: "web_footer_link", label: "Footer Links" }
    ],
    connections: { previous: "web_component", next: "web_component" }
  },
  
  web_footer_link: {
    type: 'web_footer_link',
    category: 'item',
    color: 330,
    tooltip: "Add a link to the footer",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a",
    inputs: [
      { type: "label", text: "Footer Link" },
      { type: "row", children: [
        { type: "label", text: "Text" },
        { type: "field_text", name: "TEXT", default: "Privacy Policy" }
      ]},
      { type: "row", children: [
        { type: "label", text: "URL" },
        { type: "field_text", name: "URL", default: "/privacy" }
      ]}
    ],
    connections: { previous: "web_footer_link", next: "web_footer_link" }
  }
};

// Create and export the footer block definitions
export const footerDefinitions = createBlockDefinitions(footerBlockConfigs);

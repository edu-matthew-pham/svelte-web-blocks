/**
 * Hero section component definitions
 */
import { createBlockDefinitions } from '$lib/utils/block-factory.js';
import type { WebBlockConfigs } from '$lib/types.js';

// Define hero block configurations
const heroBlockConfigs: WebBlockConfigs = {
  web_hero: {
    type: 'web_hero',
    category: 'component',
    color: 160,
    tooltip: "Add a hero section with headline and call-to-action",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section",
    inputs: [
      { 
        type: "combined_input", 
        fields: [
          { type: "label", text: "Hero Section" },
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
        { type: "field_text", name: "HEADLINE", default: "Welcome to our website" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Subheadline" },
        { type: "field_text", name: "SUBHEADLINE", default: "The best solution for your needs" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Button" },
        { type: "field_text", name: "BUTTON_TEXT", default: "Get Started" },
        { type: "label", text: "URL" },
        { type: "field_text", name: "BUTTON_URL", default: "#" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Include image" },
        { type: "field_checkbox", name: "HAS_IMAGE", checked: true }
      ]},
      { type: "row", children: [
        { type: "label", text: "Image URL" },
        { type: "field_text", name: "IMAGE_URL", default: "https://placekitten.com/500/300" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" }
  }
};

// Create and export the hero block definitions
export const heroDefinitions = createBlockDefinitions(heroBlockConfigs);


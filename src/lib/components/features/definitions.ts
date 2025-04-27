import { createBlockDefinitions, COMMON_ICONS } from '$lib/utils/block-factory.js';
import type { WebBlockConfigs } from '$lib/types.js';


// Define feature block configurations
const featuresBlockConfigs: WebBlockConfigs = {
  web_feature_cards: {
    type: 'web_feature_cards',
    category: 'component',
    color: 330,
    tooltip: "Add feature cards section",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Feature Cards" },
        { type: "label", text: "ID" },
        { type: "field_text", name: "ID", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Class" },
        { type: "field_text", name: "CLASS", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Title" },
        { type: "field_text", name: "TITLE", default: "Our Features" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Columns" },
        { type: "field_number", name: "COLUMNS", default: "3", min: 1, max: 6 }
      ]},
      { type: "row", children: [
        { type: "label", text: "Background" }
      ]},
      { type: "statement", name: "CARDS", check: "web_feature_card", label: "Features" }
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Feature Cards",
      description: "A section displaying feature cards in a grid layout",
      properties: {
        ID: {
          type: "string",
          description: "Component identifier"
        },
        CLASS: {
          type: "string",
          description: "CSS classes to apply"
        },
        TITLE: {
          type: "string",
          description: "Section title",
          default: "Our Features"
        },
        COLUMNS: {
          type: "number",
          description: "Number of columns in the grid",
          default: 3,
          minimum: 1,
          maximum: 6
        },
        CARDS: {
          type: "array",
          description: "Feature cards contained in this section",
          items: {
            type: "object",
            $ref: "#/definitions/web_feature_card"
          }
        }
      },
      required: ["TITLE", "COLUMNS"]
    }
  },
  
  web_feature_card: {
    type: 'web_feature_card',
    category: 'item',
    color: 330,
    tooltip: "Add a feature card",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Feature Card" },
        { type: "label", text: "ID" },
        { type: "field_text", name: "ID", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Class" },
        { type: "field_text", name: "CLASS", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Title" },
        { type: "field_text", name: "TITLE", default: "Feature Title" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Icon" },
        { type: "field_dropdown", name: "ICON", options: COMMON_ICONS }
      ]},
      { type: "row", children: [
        { type: "label", text: "Description" },
        { type: "field_multiline", name: "DESCRIPTION", default: "Description of this amazing feature." }
      ]}
    ],
    connections: { previous: "web_feature_card", next: "web_feature_card" },
    schema: {
      type: "object",
      title: "Feature Card",
      description: "A card highlighting a specific feature with icon and description",
      properties: {
        ID: {
          type: "string",
          description: "Card identifier"
        },
        CLASS: {
          type: "string",
          description: "CSS classes to apply"
        },
        TITLE: {
          type: "string",
          description: "Feature title",
          default: "Feature Title"
        },
        ICON: {
          type: "string",
          description: "Icon representing the feature"
        },
        DESCRIPTION: {
          type: "string",
          description: "Feature description text",
          default: "Description of this amazing feature."
        }
      },
      required: ["TITLE", "DESCRIPTION"]
    }
  }
};

// Create and export the feature block definitions
export const featuresDefinitions = createBlockDefinitions(featuresBlockConfigs); 
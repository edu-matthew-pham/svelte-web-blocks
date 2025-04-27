import { createBlockDefinitions } from '$lib/utils/block-factory.js';
import type { WebBlockConfigs } from '$lib/types.js';

// Define dynamic component block configurations
const dynamicBlockConfigs: WebBlockConfigs = {
  web_dynamic_cards: {
    type: 'web_dynamic_cards',
    category: 'component',
    color: 210,
    tooltip: "Display dynamic cards from JSON data",
    helpUrl: "https://getbootstrap.com/docs/5.3/components/card/",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Dynamic Cards" },
        { type: "label", text: "ID" },
        { type: "field_text", name: "ID", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Class" },
        { type: "field_text", name: "CLASS", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Title" },
        { type: "field_text", name: "TITLE", default: "Features" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Layout" },
        { type: "field_dropdown", name: "LAYOUT", options: [
          ["Grid", "grid"],
          ["List", "list"],
          ["Carousel", "carousel"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Columns" },
        { type: "field_dropdown", name: "COLUMNS", options: [
          ["1", "1"],
          ["2", "2"],
          ["3", "3"],
          ["4", "4"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Data (JSON)" },
        { type: "field_multiline", name: "DATA", default: '[\n  {"title": "Fast Performance", "icon": "🚀", "description": "Our platform is optimized for speed and reliability."},\n  {"title": "Easy to Use", "icon": "⚡", "description": "Simple interface that anyone can master quickly."},\n  {"title": "Powerful Analytics", "icon": "📊", "description": "Gain insights with comprehensive data analysis."}\n]' }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Dynamic Cards",
      description: "Display dynamic cards from JSON data",
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
          default: "Features"
        },
        LAYOUT: {
          type: "string",
          description: "Layout style for the cards",
          enum: ["grid", "list", "carousel"],
          default: "grid"
        },
        COLUMNS: {
          type: "string",
          description: "Number of columns in grid layout",
          enum: ["1", "2", "3", "4"],
          default: "3"
        },
        DATA: {
          type: "string",
          description: "JSON data for the cards",
          default: '[\n  {"title": "Fast Performance", "icon": "🚀", "description": "Our platform is optimized for speed and reliability."},\n  {"title": "Easy to Use", "icon": "⚡", "description": "Simple interface that anyone can master quickly."},\n  {"title": "Powerful Analytics", "icon": "📊", "description": "Gain insights with comprehensive data analysis."}\n]'
        }
      },
      required: ["TITLE", "LAYOUT", "DATA"]
    }
  },
  
  web_image_gallery: {
    type: 'web_image_gallery',
    category: 'component',
    color: 210,
    tooltip: "Display images in a gallery format",
    helpUrl: "https://getbootstrap.com/docs/5.3/components/carousel/",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Image Gallery" },
        { type: "label", text: "ID" },
        { type: "field_text", name: "ID", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Class" },
        { type: "field_text", name: "CLASS", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Title" },
        { type: "field_text", name: "TITLE", default: "Gallery" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Thumbnail Size" },
        { type: "field_dropdown", name: "THUMBNAIL_SIZE", options: [
          ["Small", "small"],
          ["Medium", "medium"],
          ["Large", "large"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Lightbox" },
        { type: "field_dropdown", name: "LIGHTBOX", options: [["Yes", "TRUE"], ["No", "FALSE"]] }
      ]},
      { type: "row", children: [
        { type: "label", text: "Data (JSON)" },
        { type: "field_multiline", name: "DATA", default: '[\n  {"url": "https://picsum.photos/id/1/800/600", "caption": "Mountain View", "thumbnail": "https://picsum.photos/id/1/200/150"},\n  {"url": "https://picsum.photos/id/10/800/600", "caption": "Ocean Waves", "thumbnail": "https://picsum.photos/id/10/200/150"},\n  {"url": "https://picsum.photos/id/100/800/600", "caption": "Beach Sunset", "thumbnail": "https://picsum.photos/id/100/200/150"}\n]' }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Image Gallery",
      description: "Display images in a gallery format",
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
          description: "Gallery title",
          default: "Gallery"
        },
        THUMBNAIL_SIZE: {
          type: "string",
          description: "Size of thumbnail images",
          enum: ["small", "medium", "large"],
          default: "medium"
        },
        LIGHTBOX: {
          type: "string",
          description: "Enable lightbox for full-size image viewing",
          enum: ["TRUE", "FALSE"],
          default: "TRUE"
        },
        DATA: {
          type: "string",
          description: "JSON data for gallery images",
          default: '[\n  {"url": "https://picsum.photos/id/1/800/600", "caption": "Mountain View", "thumbnail": "https://picsum.photos/id/1/200/150"},\n  {"url": "https://picsum.photos/id/10/800/600", "caption": "Ocean Waves", "thumbnail": "https://picsum.photos/id/10/200/150"},\n  {"url": "https://picsum.photos/id/100/800/600", "caption": "Beach Sunset", "thumbnail": "https://picsum.photos/id/100/200/150"}\n]'
        }
      },
      required: ["TITLE", "DATA"]
    }
  },
  
  web_accordion: {
    type: 'web_accordion',
    category: 'component',
    color: 210,
    tooltip: "Create an accordion component for FAQs or collapsible content",
    helpUrl: "https://getbootstrap.com/docs/5.3/components/accordion/",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Accordion" },
        { type: "label", text: "ID" },
        { type: "field_text", name: "ID", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Class" },
        { type: "field_text", name: "CLASS", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Title" },
        { type: "field_text", name: "TITLE", default: "Frequently Asked Questions" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Allow Multiple Open" },
        { type: "field_dropdown", name: "ALLOW_MULTIPLE", options: [["Yes", "TRUE"], ["No", "FALSE"]] }
      ]},
      { type: "row", children: [
        { type: "label", text: "Data (JSON - use title/content format)" },
        { type: "field_multiline", name: "DATA", default: '[\n  {"title": "How do I get started?", "content": "Sign up for an account and follow our simple onboarding process."},\n  {"title": "Is there a free trial?", "content": "Yes, we offer a 14-day free trial with all features included."},\n  {"title": "How does billing work?", "content": "We offer monthly and annual subscription plans with various tiers."}\n]' }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" },
    schema: {
      type: "object",
      title: "Accordion",
      description: "Create an accordion component for FAQs or collapsible content",
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
          description: "Accordion section title",
          default: "Frequently Asked Questions"
        },
        ALLOW_MULTIPLE: {
          type: "string",
          description: "Allow multiple accordion items to be open simultaneously",
          enum: ["TRUE", "FALSE"],
          default: "FALSE"
        },
        DATA: {
          type: "string",
          description: "JSON data for accordion items with title and content",
          default: '[\n  {"title": "How do I get started?", "content": "Sign up for an account and follow our simple onboarding process."},\n  {"title": "Is there a free trial?", "content": "Yes, we offer a 14-day free trial with all features included."},\n  {"title": "How does billing work?", "content": "We offer monthly and annual subscription plans with various tiers."}\n]'
        }
      },
      required: ["TITLE", "DATA"]
    }
  }
};

// Create and export the dynamic component block definitions
export const dynamicDefinitions = createBlockDefinitions(dynamicBlockConfigs);

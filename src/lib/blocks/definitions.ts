import type { WebBlockDefinitions, BlockConfig, BlockInputConfig, WebBlockConfigs } from '../types.js';
import * as Blockly from 'blockly';

// Fix imports for multiline input and color field plugins
import * as MultilineInput from '@blockly/field-multilineinput';
import * as ColourField from '@blockly/field-colour';

// Access the field classes directly - these plugins likely export the class as a property
const FieldMultilineInput = MultilineInput.FieldMultilineInput || MultilineInput;
const FieldColour = ColourField.FieldColour || ColourField;

// Only initialize JavaScript generator in browser context
const isBrowser = typeof window !== 'undefined';
const javascriptGenerator = isBrowser ? Blockly.JavaScript : null;

// Add this near the top of the file with other constants
const COMMON_ICONS: [string, string][] = [
  ["🚀 Rocket", "🚀"],
  ["💡 Light Bulb", "💡"],
  ["⚙️ Gear", "⚙️"],
  ["📱 Mobile", "📱"],
  ["💻 Laptop", "💻"],
  ["🔒 Security", "🔒"],
  ["📊 Chart", "📊"],
  ["🔍 Search", "🔍"],
  ["⚡ Lightning", "⚡"],
  ["🎯 Target", "🎯"],
  ["🌟 Star", "🌟"],
  ["📝 Document", "📝"],
  ["🔄 Sync", "🔄"],
  ["👥 Users", "👥"],
  ["💬 Chat", "💬"]
];

// Block configurations as data structures
const blockConfigs: WebBlockConfigs = {
  web_header: {
    type: 'web_header',
    category: 'document',
    color: 230,
    tooltip: "Add a page header with navigation",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header",
    inputs: [
      { type: "label", text: "Header" },
      { type: "field_text", name: "LOGO_TEXT", default: "My Website" },
      { type: "row", children: [
        { type: "label", text: "Include Sign-up Button" },
        { type: "field_checkbox", name: "INCLUDE_SIGNUP", checked: true }
      ]},
      { type: "statement", name: "LINKS", check: "web_nav_item", label: "Navigation links" }
    ],
    connections: { previous: "web_component", next: "web_component" }
  },
  
  web_nav_item: {
    type: 'web_nav_item',
    category: 'item',
    color: 230,
    tooltip: "Add a navigation link",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a",
    inputs: [
      { type: "label", text: "Link" },
      { type: "field_text", name: "TEXT", default: "Home" },
      { type: "label", text: "URL" },
      { type: "field_text", name: "URL", default: "#" }
    ],
    connections: { previous: "web_nav_item", next: "web_nav_item" }
  },
  
  web_hero: {
    type: 'web_hero',
    category: 'component',
    color: 160,
    tooltip: "Add a hero section with headline and call-to-action",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section",
    inputs: [
      { type: "label", text: "Hero Section" },
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
  },
  
  web_feature_cards: {
    type: 'web_feature_cards',
    category: 'component',
    color: 330,
    tooltip: "Add feature cards section",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout",
    inputs: [
      { type: "label", text: "Feature Cards" },
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
    connections: { previous: "web_component", next: "web_component" }
  },
  
  web_feature_card: {
    type: 'web_feature_card',
    category: 'item',
    color: 330,
    tooltip: "Add a feature card",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout",
    inputs: [
      { type: "label", text: "Feature Card" },
      { type: "row", children: [
        { type: "label", text: "Icon" },
        { type: "field_dropdown", name: "ICON", options: COMMON_ICONS }
      ]},
      { type: "row", children: [
        { type: "label", text: "Title" },
        { type: "field_text", name: "TITLE", default: "Feature Title" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Description" },
        { type: "field_multiline", name: "DESCRIPTION", default: "Description of this amazing feature." }
      ]}
    ],
    connections: { previous: "web_feature_card", next: "web_feature_card" }
  },
  
  web_content_section: {
    type: 'web_content_section',
    category: 'component',
    color: 120,
    tooltip: "Add a content section with headline and text",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section",
    inputs: [
      { type: "label", text: "Content Section" },
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
      { type: "label", text: "Content Block (Markdown supported)" },
      { type: "row", children: [
        { type: "label", text: "Content" },
        { type: "field_multiline", name: "CONTENT", default: "# Heading\n\nAdd your **formatted** content here.\n\n- Bullet point\n- Another point\n\n[Link text](https://example.com)" }
      ]}
    ],
    connections: { previous: "web_content_block", next: "web_content_block" }
  },
  
  web_basic_form: {
    type: 'web_basic_form',
    category: 'component',
    color: 60,
    tooltip: "Add a form for user input",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form",
    inputs: [
      { type: "label", text: "Form" },
      { type: "row", children: [
        { type: "label", text: "Title" },
        { type: "field_text", name: "TITLE", default: "Contact Us" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Submit Button Text" },
        { type: "field_text", name: "SUBMIT_TEXT", default: "Send" }
      ]},
      { type: "statement", name: "FIELDS", check: "web_form_field", label: "Form Fields" }
    ],
    connections: { previous: "web_component", next: "web_component" }
  },
  
  web_form_field: {
    type: 'web_form_field',
    category: 'item',
    color: 60,
    tooltip: "Add a field to your form",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input",
    inputs: [
      { type: "label", text: "Form Field" },
      { type: "row", children: [
        { type: "label", text: "Label" },
        { type: "field_text", name: "LABEL", default: "Email" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Type" },
        { type: "field_dropdown", name: "TYPE", options: [
          ["Text", "text"], 
          ["Email", "email"], 
          ["Number", "number"],
          ["Phone", "tel"],
          ["Textarea", "textarea"],
          ["Checkbox", "checkbox"],
          ["Radio Buttons", "radio"],
          ["Dropdown Select", "select"],
          ["Date Picker", "date"],
          ["Time Picker", "time"]
        ]}
      ]},
      { type: "row", children: [
        { type: "label", text: "Required" },
        { type: "field_dropdown", name: "REQUIRED", options: [["Yes", "TRUE"], ["No", "FALSE"]] }
      ]},
      { type: "row", children: [
        { type: "label", text: "Options (comma separated for select/radio)" },
        { type: "field_text", name: "OPTIONS", default: "Option 1, Option 2, Option 3" }
      ]}
    ],
    connections: { previous: "web_form_field", next: "web_form_field" }
  },
  
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
  },
  
  web_document: {
    type: 'web_document',
    category: 'document',
    color: 290,
    tooltip: "Create a complete webpage with Bootstrap included",
    helpUrl: "https://getbootstrap.com/",
    inputs: [
      { type: "label", text: "Web Document" },
      { type: "row", children: [
        { type: "label", text: "Title" },
        { type: "field_text", name: "TITLE", default: "My Web Page" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Theme" },
        { type: "field_dropdown", name: "THEME", options: [
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
        ]}
      ]},
      { type: "statement", name: "CONTENT", check: "web_component", label: "Content" }
    ],
    connections: { previous: false, next: false }
  },
  
  web_dynamic_cards: {
    type: 'web_dynamic_cards',
    category: 'component',
    color: 210,
    tooltip: "Display dynamic cards from JSON data",
    helpUrl: "https://getbootstrap.com/docs/5.3/components/card/",
    inputs: [
      { type: "label", text: "Dynamic Cards" },
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
    connections: { previous: "web_component", next: "web_component" }
  },
  
  web_image_gallery: {
    type: 'web_image_gallery',
    category: 'component',
    color: 210,
    tooltip: "Display images in a gallery format",
    helpUrl: "https://getbootstrap.com/docs/5.3/components/carousel/",
    inputs: [
      { type: "label", text: "Image Gallery" },
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
    connections: { previous: "web_component", next: "web_component" }
  },
  
  web_accordion: {
    type: 'web_accordion',
    category: 'component',
    color: 210,
    tooltip: "Create an accordion component for FAQs or collapsible content",
    helpUrl: "https://getbootstrap.com/docs/5.3/components/accordion/",
    inputs: [
      { type: "label", text: "Accordion" },
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
    connections: { previous: "web_component", next: "web_component" }
  },
  

  // JavaScript interactivity blocks
js_event_listener: {
  type: 'js_event_listener',
  category: 'javascript',
  color: 180,
  tooltip: "Listen for events on elements",
  helpUrl: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener",
  inputs: [
    { type: "label", text: "When" },
    { type: "row", children: [
      { type: "field_text", name: "ELEMENT_SELECTOR", default: "#button-id" }
    ]},
    { type: "row", children: [
      { type: "field_dropdown", name: "EVENT_TYPE", options: [
        ["is clicked", "click"], 
        ["is hovered", "mouseover"],
        ["is no longer hovered", "mouseout"],
        ["receives key press", "keypress"],
        ["is submitted", "submit"],
        ["changes value", "change"],
        ["page scrolls", "scroll"],
        ["page loads", "load"]
      ]}
    ]},
    // Contains other blocks
    { type: "statement", name: "DO" }
  ],
  connections: { previous: "web_component", next: "web_component" }
},

js_dom_visibility: {
  type: 'js_dom_visibility',
  category: 'javascript',
  color: 180,
  tooltip: "Change element visibility",
  helpUrl: "",
  inputs: [
    { type: "row", children: [
      { type: "field_dropdown", name: "ACTION", options: [
        ["Show", "show"],
        ["Hide", "hide"],
        ["Toggle visibility of", "toggle"]
      ]},
      { type: "field_text", name: "SELECTOR", default: "#element-id" }
    ]}
  ],
  connections: { previous: "javascript", next: "javascript" }
},

js_dom_class: {
  type: 'js_dom_class',
  category: 'javascript',
  color: 180,
  tooltip: "Modify element classes",
  helpUrl: "",
  inputs: [
    { type: "row", children: [
      { type: "field_dropdown", name: "ACTION", options: [
        ["Add class", "add"],
        ["Remove class", "remove"],
        ["Toggle class", "toggle"]
      ]},
      { type: "field_text", name: "CLASS_NAME", default: "active" },
      { type: "label", text: "on" },
      { type: "field_text", name: "SELECTOR", default: "#element-id" }
    ]}
  ],
  connections: { previous: "javascript", next: "javascript" }
},

js_dom_content: {
  type: 'js_dom_content',
  category: 'javascript',
  color: 180,
  tooltip: "Change element content",
  helpUrl: "",
  inputs: [
    { type: "row", children: [
      { type: "field_dropdown", name: "ACTION", options: [
        ["Set text of", "text"],
        ["Set HTML of", "html"]
      ]},
      { type: "field_text", name: "SELECTOR", default: "#element-id" },
      { type: "label", text: "to" }
    ]},
    { type: "row", children: [
      { type: "field_text", name: "CONTENT", default: "New content" }
    ]}
  ],
  connections: { previous: "javascript", next: "javascript" }
},

js_dom_attribute: {
  type: 'js_dom_attribute',
  category: 'javascript',
  color: 180,
  tooltip: "Set element attributes",
  helpUrl: "",
  inputs: [
    { type: "row", children: [
      { type: "label", text: "Set attribute" },
      { type: "field_text", name: "ATTRIBUTE", default: "src" },
      { type: "label", text: "of" },
      { type: "field_text", name: "SELECTOR", default: "#image" }
    ]},
    { type: "row", children: [
      { type: "label", text: "to" },
      { type: "field_text", name: "VALUE", default: "image.jpg" }
    ]}
  ],
  connections: { previous: "javascript", next: "javascript" }
},

js_log: {
  type: 'js_log',
  category: 'javascript',
  color: 180,
  tooltip: "Log message to console",
  helpUrl: "",
  inputs: [
    { type: "row", children: [
      { type: "label", text: "Log to console:" },
      { type: "field_text", name: "MESSAGE", default: "Hello, world!" }
    ]}
  ],
  connections: { previous: "javascript", next: "javascript" }
},
  
  // Reactive Data blocks
  reactive_store_create: {
    type: 'reactive_store_create',
    category: 'reactive',
    color: 290,
    tooltip: "Create a reactive data store that automatically updates UI when changed",
    helpUrl: "",
    inputs: [
      { type: "label", text: "Create Reactive Store" },
      { type: "row", children: [
        { type: "label", text: "Store Name" },
        { type: "field_text", name: "STORE_NAME", default: "appState" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Initial Data (JSON)" },
        { type: "field_multiline", name: "INITIAL_DATA", default: '{\n  "count": 0,\n  "username": "",\n  "items": [],\n  "isLoggedIn": false\n}' }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" }
  },
  
  reactive_get_value: {
    type: 'reactive_get_value',
    category: 'reactive',
    color: 290,
    tooltip: "Get a value from the reactive store",
    helpUrl: "",
    inputs: [
      { type: "label", text: "Get Value from Store" },
      { type: "row", children: [
        { type: "label", text: "Store Name" },
        { type: "field_text", name: "STORE_NAME", default: "appState" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Property Key" },
        { type: "field_text", name: "KEY", default: "count" }
      ]}
    ],
    connections: { previous: false, next: false, output: "String" }
  },
  
  reactive_set_value: {
    type: 'reactive_set_value',
    category: 'reactive',
    color: 290,
    tooltip: "Set a value in the reactive store and update UI",
    helpUrl: "",
    inputs: [
      { type: "label", text: "Set Value in Store" },
      { type: "row", children: [
        { type: "label", text: "Store Name" },
        { type: "field_text", name: "STORE_NAME", default: "appState" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Property Key" },
        { type: "field_text", name: "KEY", default: "count" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Expression" },
        { type: "input_value", name: "VALUE", check: "String" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" }
  },
  
  reactive_bind_element: {
    type: 'reactive_bind_element',
    category: 'reactive',
    color: 290,
    tooltip: "Bind a DOM element to a reactive store value",
    helpUrl: "",
    inputs: [
      { type: "label", text: "Bind Element to Store Value" },
      { type: "row", children: [
        { type: "label", text: "Element Selector" },
        { type: "field_text", name: "ELEMENT_SELECTOR", default: "#counter" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Store Name" },
        { type: "field_text", name: "STORE_NAME", default: "appState" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Property Key" },
        { type: "field_text", name: "KEY", default: "count" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Element Attribute" },
        { type: "field_dropdown", name: "ATTRIBUTE", options: [
          ["Text Content", "textContent"],
          ["HTML Content", "innerHTML"],
          ["Value", "value"],
          ["Visibility", "visible"],
          ["CSS Class", "class"],
          ["Enabled/Disabled", "disabled"]
        ]}
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" }
  },
  
  reactive_bind_template: {
    type: 'reactive_bind_template',
    category: 'reactive',
    color: 290,
    tooltip: "Bind data from store to a dynamic content container",
    helpUrl: "",
    inputs: [
      { type: "label", text: "Bind Data to Container" },
      { type: "row", children: [
        { type: "label", text: "Container Selector" },
        { type: "field_text", name: "CONTAINER_SELECTOR", default: "#items-container" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Store Name" },
        { type: "field_text", name: "STORE_NAME", default: "appState" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Array Property Key" },
        { type: "field_text", name: "ARRAY_KEY", default: "items" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Item Schema (JSON)" },
        { type: "field_multiline", name: "SCHEMA", default: '{\n  "id": "string",\n  "title": "string",\n  "description": "string"\n}' }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" }
  },
  
  reactive_set_expression: {
    type: 'reactive_set_expression',
    category: 'reactive',
    color: 290,
    tooltip: "Set a value in the reactive store using a JavaScript expression",
    helpUrl: "",
    inputs: [
      { type: "label", text: "Set Value with Expression" },
      { type: "row", children: [
        { type: "label", text: "Store Name" },
        { type: "field_text", name: "STORE_NAME", default: "appState" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Property Key" },
        { type: "field_text", name: "KEY", default: "count" }
      ]},
      { type: "row", children: [
        { type: "label", text: "JavaScript" },
        { type: "field_multiline", name: "EXPRESSION", default: "appState.count + 1" }
      ]}
    ],
    connections: { previous: "web_component", next: "web_component" }
  },
  
  reactive_listen: {
    type: 'reactive_listen',
    category: 'reactive',
    color: 290,
    tooltip: "Execute blocks when store value changes",
    helpUrl: "",
    inputs: [
      { type: "label", text: "When Value Changes" },
      { type: "row", children: [
        { type: "label", text: "Store Name" },
        { type: "field_text", name: "STORE_NAME", default: "appState" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Property Key" },
        { type: "field_text", name: "KEY", default: "count" }
      ]},
      { type: "row", children: [
        { type: "label", text: "New Value Variable" },
        { type: "field_text", name: "NEW_VALUE_VAR", default: "newValue" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Old Value Variable" },
        { type: "field_text", name: "OLD_VALUE_VAR", default: "oldValue" }
      ]},
      // This is a container for other blocks
      { type: "statement", name: "DO" }
    ],
    connections: { previous: "web_component", next: "web_component" }
  },
  
  reactive_get_new_value: {
    type: 'reactive_get_new_value',
    category: 'reactive',
    color: 290,
    tooltip: "Get the new value from the reactive listener",
    helpUrl: "",
    inputs: [
      { type: "label", text: "new value" }
    ],
    connections: { 
      previous: false, 
      next: false,
      output: "String"  // Can output any type
    }
  },
  
  reactive_get_old_value: {
    type: 'reactive_get_old_value',
    category: 'reactive',
    color: 290,
    tooltip: "Get the previous value from the reactive listener",
    helpUrl: "",
    inputs: [
      { type: "label", text: "old value" }
    ],
    connections: { 
      previous: false, 
      next: false,
      output: "String"  // Can output any type
    }
  },

  js_dom_modify: {
    type: 'js_dom_modify',
    category: 'javascript',
    color: 180,
    tooltip: "Modify an element on the page",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector",
    inputs: [
      { type: "row", children: [
        { type: "field_dropdown", name: "ACTION", options: [
          ["Set text of", "text"],
          ["Set HTML of", "html"],
          ["Set attribute", "attribute"],
          ["Set style", "style"],
          ["Add class to", "addClass"],
          ["Remove class from", "removeClass"],
          ["Toggle class on", "toggleClass"],
          ["Show", "show"],
          ["Hide", "hide"],
          ["Toggle visibility of", "toggle"]
        ]},
        { type: "field_text", name: "SELECTOR", default: "#element-id" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Property/key (for attribute/style):" },
        { type: "field_text", name: "PROPERTY", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Value:" },
        { type: "field_text", name: "VALUE", default: "" }
      ]}
    ],
    connections: { previous: "javascript", next: "javascript" }
  },

  create_object: {
    type: 'create_object',
    category: 'dataObjects',
    color: 170,
    tooltip: "Create a new object with the specified properties",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object",
    inputs: [
      { type: "label", text: "Create Object" },
      { type: "row", children: [
        { type: "field_multiline", name: "OBJECT", default: '{\n  "key1": "value1",\n  "key2": 42\n}' }
      ]}
    ],
    connections: { previous: false, next: false, output: "Object" }
  },
  
  get_object_property: {
    type: 'get_object_property',
    category: 'dataObjects',
    color: 170,
    tooltip: "Get a property value from an object",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_Accessors",
    inputs: [
      { type: "label", text: "Get Property" },
      { type: "row", children: [
        { type: "field_text", name: "PROPERTY", default: "key" }
      ]},
      { type: "row", children: [
        { type: "label", text: "from object" },
        { type: "input_value", name: "OBJECT", check: "Object" }
      ]}
    ],
    connections: { previous: false, next: false, output: "String" }
  },
  
  set_object_property: {
    type: 'set_object_property',
    category: 'dataObjects',
    color: 170,
    tooltip: "Set a property value in an object",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_Accessors",
    inputs: [
      { type: "label", text: "Set Property" },
      { type: "row", children: [
        { type: "field_text", name: "PROPERTY", default: "key" }
      ]},
      { type: "row", children: [
        { type: "label", text: "in object" },
        { type: "input_value", name: "OBJECT", check: "Object" }
      ]},
      { type: "row", children: [
        { type: "label", text: "to value" },
        { type: "input_value", name: "VALUE" }
      ]}
    ],
    connections: { previous: "javascript", next: "javascript" }
  },
  
  parse_json: {
    type: 'parse_json',
    category: 'dataObjects',
    color: 170,
    tooltip: "Parse a JSON string into an object",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse",
    inputs: [
      { type: "label", text: "Parse JSON string" },
      { type: "row", children: [
        { type: "input_value", name: "JSON_STRING", check: "String" }
      ]}
    ],
    connections: { previous: false, next: false, output: "Object" }
  },
  
  stringify_object: {
    type: 'stringify_object',
    category: 'dataObjects',
    color: 170,
    tooltip: "Convert an object to a JSON string",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify",
    inputs: [
      { type: "label", text: "Convert to JSON string" },
      { type: "row", children: [
        { type: "input_value", name: "OBJECT", check: "Object" }
      ]}
    ],
    connections: { previous: false, next: false, output: "String" }
  },

  // Add these new block configurations to the blockConfigs object
  js_simple_expression: {
    type: 'js_simple_expression',
    category: 'expressions',
    color: 230,
    tooltip: "Create a simple JavaScript expression",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators",
    inputs: [
      { type: "label", text: "Expression" },
      { type: "row", children: [
        { type: "field_multiline", name: "EXPRESSION", default: "42" }
      ]}
    ],
    connections: { previous: false, next: false, output: "String" }
  },

  js_format_currency: {
    type: 'js_format_currency',
    category: 'expressions',
    color: 230,
    tooltip: "Format a number as currency",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat",
    inputs: [
      { type: "label", text: "Format as Currency" },
      { type: "input_value", name: "AMOUNT", check: "Number" },
      { type: "row", children: [
        { type: "label", text: "Currency" },
        { type: "field_dropdown", name: "CURRENCY", options: [
          ["USD ($)", "USD"],
          ["EUR (€)", "EUR"],
          ["GBP (£)", "GBP"],
          ["JPY (¥)", "JPY"],
          ["CAD (C$)", "CAD"],
          ["AUD (A$)", "AUD"],
          ["CNY (¥)", "CNY"],
          ["INR (₹)", "INR"]
        ]}
      ]}
    ],
    connections: { previous: false, next: false, output: "String" }
  },

  js_format_date: {
    type: 'js_format_date',
    category: 'expressions',
    color: 230,
    tooltip: "Format a date in various styles",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat",
    inputs: [
      { type: "label", text: "Format Date" },
      { type: "input_value", name: "DATE", check: "Date" },
      { type: "row", children: [
        { type: "label", text: "Format" },
        { type: "field_dropdown", name: "FORMAT", options: [
          ["Short (MM/DD/YYYY)", "short"],
          ["Medium (Mon DD, YYYY)", "medium"],
          ["Long (Month DD, YYYY)", "long"],
          ["Full (Day, Month DD, YYYY)", "full"],
          ["Time only (HH:MM)", "time"],
          ["Date + Time", "datetime"]
        ]}
      ]}
    ],
    connections: { previous: false, next: false, output: "String" }
  },

  js_calculate_percentage: {
    type: 'js_calculate_percentage',
    category: 'expressions',
    color: 230,
    tooltip: "Calculate a percentage value",
    helpUrl: "",
    inputs: [
      { type: "label", text: "Calculate Percentage" },
      { type: "input_value", name: "VALUE", check: "Number" },
      { type: "label", text: "of Total" },
      { type: "input_value", name: "TOTAL", check: "Number" }
    ],
    connections: { previous: false, next: false, output: "Number" }
  },

  js_string_template: {
    type: 'js_string_template',
    category: 'expressions',
    color: 230,
    tooltip: "Create a string with variable replacements",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals",
    inputs: [
      { type: "label", text: "String Template" },
      { type: "row", children: [
        { type: "field_multiline", name: "TEMPLATE", default: "Hello, {name}! Your score is {score}." }
      ]},
      { type: "label", text: "Variables Object" },
      { type: "input_value", name: "VARIABLES", check: "Object" }
    ],
    connections: { previous: false, next: false, output: "String" }
  },

  js_validate_input: {
    type: 'js_validate_input',
    category: 'expressions',
    color: 230,
    tooltip: "Validate user input data",
    helpUrl: "",
    inputs: [
      { type: "label", text: "Validate Input" },
      { type: "row", children: [
        { type: "label", text: "Type" },
        { type: "field_dropdown", name: "TYPE", options: [
          ["Email", "email"],
          ["Phone Number", "phone"],
          ["URL", "url"],
          ["Number", "number"],
          ["Required", "required"],
          ["Minimum Length", "minLength"],
          ["Maximum Length", "maxLength"],
          ["Regex Pattern", "pattern"]
        ]}
      ]},
      { type: "label", text: "Value" },
      { type: "input_value", name: "VALUE", check: "String" }
    ],
    connections: { previous: false, next: false, output: "Boolean" }
  },

  js_data_operation: {
    type: 'js_data_operation',
    category: 'expressions',
    color: 230,
    tooltip: "Perform operations on arrays of data",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
    inputs: [
      { type: "label", text: "Array Operation" },
      { type: "row", children: [
        { type: "field_dropdown", name: "OPERATION", options: [
          ["Filter", "filter"],
          ["Map", "map"],
          ["Sort", "sort"],
          ["Find", "find"],
          ["Reduce", "reduce"],
          ["Count where", "count"]
        ]}
      ]},
      { type: "label", text: "Data Array" },
      { type: "input_value", name: "ARRAY", check: "Array" },
      { type: "row", children: [
        { type: "label", text: "Condition/Transform" },
        { type: "field_multiline", name: "CONDITION", default: "item.price > 20" }
      ]}
    ],
    connections: { previous: false, next: false, output: "Array" }
  },

  js_custom_expression: {
    type: 'js_custom_expression',
    category: 'expressions',
    color: 230,
    tooltip: "Create a custom JavaScript expression",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    inputs: [
      { type: "label", text: "Custom JavaScript" },
      { type: "row", children: [
        { type: "field_multiline", name: "CODE", default: "// Your custom expression here" }
      ]}
    ],
    connections: { previous: false, next: false, output: "String" }
  },

  list_create: {
    type: 'list_create',
    category: 'lists',
    color: 160,
    tooltip: "Create a new list with comma-separated items",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
    inputs: [
      { type: "label", text: "Create List" },
      { type: "row", children: [
        { type: "field_text", name: "DATA", default: "item1, item2, item3" }
      ]}
    ],
    connections: { previous: false, next: false, output: "Array" }
  },

  list_operation: {
    type: 'list_operation',
    category: 'lists',
    color: 160,
    tooltip: "Perform operations on a list",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
    inputs: [
      { type: "label", text: "List Operation" },
      { type: "row", children: [
        { type: "field_dropdown", name: "OPERATION", options: [
          ["add item", "add"],
          ["remove item", "remove"],
          ["get item", "get"],
          ["set item", "set"]
        ]}
      ]},
      { type: "row", children: [
        { type: "input_value", name: "LIST", check: "Array" }
      ]},
      { type: "row", children: [
        { type: "label", text: "at index" },
        { type: "input_value", name: "INDEX", check: "Number" }
      ]},
      { type: "row", children: [
        { type: "label", text: "value" },
        { type: "input_value", name: "ITEM" }
      ]},
      { type: "row", children: [
        { type: "field_dropdown", name: "REMOVE_TYPE", options: [
          ["at index", "index"],
          ["matching value", "value"]
        ]}
      ]}
    ],
    connections: { previous: "javascript", next: "javascript", output: "String" }
  },

  list_query: {
    type: 'list_query',
    category: 'lists',
    color: 160,
    tooltip: "Get information about a list",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
    inputs: [
      { type: "label", text: "List Query" },
      { type: "row", children: [
        { type: "field_dropdown", name: "QUERY", options: [
          ["length", "length"],
          ["contains item", "contains"],
          ["find index of", "index"],
          ["is empty", "empty"],
          ["first item", "first"],
          ["last item", "last"]
        ]}
      ]},
      { type: "row", children: [
        { type: "input_value", name: "LIST", check: "Array" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Item" },
        { type: "input_value", name: "ITEM" }
      ]}
    ],
    connections: { previous: false, next: false, output: "String" }
  },

  list_join: {
    type: 'list_join',
    category: 'lists',
    color: 160,
    tooltip: "Join all items in a list into a string",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join",
    inputs: [
      { type: "label", text: "Join List" },
      { type: "row", children: [
        { type: "input_value", name: "LIST", check: "Array" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Separator" },
        { type: "field_text", name: "SEPARATOR", default: ", " }
      ]}
    ],
    connections: { previous: false, next: false, output: "String" }
  },

  list_sort: {
    type: 'list_sort',
    category: 'lists',
    color: 160,
    tooltip: "Sort the items in a list",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort",
    inputs: [
      { type: "label", text: "Sort List" },
      { type: "row", children: [
        { type: "input_value", name: "LIST", check: "Array" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Order" },
        { type: "field_dropdown", name: "ORDER", options: [
          ["Ascending", "ascending"],
          ["Descending", "descending"]
        ]}
      ]}
    ],
    connections: { previous: false, next: false, output: "Array" }
  },

  // Add these new block configurations to the blockConfigs object
  js_conditional: {
    type: 'js_conditional',
    category: 'logic',
    color: 210,
    tooltip: "Execute code if a condition is true",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "if" },
        { type: "field_multiline", name: "CONDITION", default: "x > 10" }
      ]},
      { type: "statement", name: "DO" }
    ],
    connections: { previous: "javascript", next: "javascript" }
  },
  
  js_conditional_else: {
    type: 'js_conditional_else',
    category: 'logic',
    color: 210,
    tooltip: "Execute code if a condition is true, otherwise execute other code",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "if" },
        { type: "field_multiline", name: "CONDITION", default: "x > 10" }
      ]},
      { type: "statement", name: "DO" },
      { type: "label", text: "else" },
      { type: "statement", name: "ELSE" }
    ],
    connections: { previous: "javascript", next: "javascript" }
  },
  
  js_comparison: {
    type: 'js_comparison',
    category: 'logic',
    color: 210,
    tooltip: "Compare two values",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#comparison_operators",
    inputs: [
      { type: "row", children: [
        { type: "field_text", name: "LEFT", default: "a" },
        { type: "field_dropdown", name: "OPERATOR", options: [
          ["=", "==="],
          ["≠", "!=="],
          [">", ">"],
          ["≥", ">="],
          ["<", "<"],
          ["≤", "<="]
        ]},
        { type: "field_text", name: "RIGHT", default: "b" }
      ]}
    ],
    connections: { previous: false, next: false, output: "Boolean" }
  },
  
  js_logical: {
    type: 'js_logical',
    category: 'logic',
    color: 210,
    tooltip: "Combine boolean expressions with logical operators",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#logical_operators",
    inputs: [
      { type: "row", children: [
        { type: "field_text", name: "LEFT", default: "a > 5" },
        { type: "field_dropdown", name: "OPERATOR", options: [
          ["and", "&&"],
          ["or", "||"]
        ]},
        { type: "field_text", name: "RIGHT", default: "b < 10" }
      ]}
    ],
    connections: { previous: false, next: false, output: "Boolean" }
  },
  
  js_for_loop: {
    type: 'js_for_loop',
    category: 'loops',
    color: 210,
    tooltip: "Loop through code with counter",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "for" },
        { type: "field_text", name: "INIT", default: "let i = 0" },
        { type: "label", text: ";" },
        { type: "field_text", name: "CONDITION", default: "i < 10" },
        { type: "label", text: ";" },
        { type: "field_text", name: "UPDATE", default: "i++" }
      ]},
      { type: "statement", name: "DO" }
    ],
    connections: { previous: "javascript", next: "javascript" }
  },
  
  js_for_of: {
    type: 'js_for_of',
    category: 'loops',
    color: 210,
    tooltip: "Loop through each item in an array",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "for each" },
        { type: "field_text", name: "VARIABLE", default: "item" },
        { type: "label", text: "in" },
        { type: "field_text", name: "ARRAY", default: "items" }
      ]},
      { type: "statement", name: "DO" }
    ],
    connections: { previous: "javascript", next: "javascript" }
  },
  
  js_while_loop: {
    type: 'js_while_loop',
    category: 'loops',
    color: 210,
    tooltip: "Loop while a condition is true",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "while" },
        { type: "field_text", name: "CONDITION", default: "count < 5" }
      ]},
      { type: "statement", name: "DO" }
    ],
    connections: { previous: "javascript", next: "javascript" }
  },
  
  js_repeat: {
    type: 'js_repeat',
    category: 'loops',
    color: 210,
    tooltip: "Repeat code a specific number of times",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "repeat" },
        { type: "field_text", name: "TIMES", default: "3" },
        { type: "label", text: "times" }
      ]},
      { type: "statement", name: "DO" }
    ],
    connections: { previous: "javascript", next: "javascript" }
  },
};

// Helper function to build inputs based on configuration
function buildInput(block: Blockly.Block, input: BlockInputConfig) {
  if (input.type === "label") {
    return block.appendDummyInput().appendField(input.text || "");
  } 
  else if (input.type === "field_text") {
    if (!input.name) return block.appendDummyInput();
    return block.appendDummyInput()
      .appendField(input.name.toLowerCase())
      .appendField(new Blockly.FieldTextInput(input.default || ""), input.name);
  } 
  else if (input.type === "field_checkbox") {
    if (!input.name) return block.appendDummyInput();
    return block.appendDummyInput()
      .appendField(input.name.toLowerCase())
      .appendField(new Blockly.FieldCheckbox(input.checked ? "TRUE" : "FALSE"), input.name);
  }
  else if (input.type === "field_multiline") {
    if (!input.name) return block.appendDummyInput();
    return block.appendDummyInput()
      .appendField(input.name.toLowerCase())
      .appendField(new FieldMultilineInput(input.default || ""), input.name);
  } 
  else if (input.type === "field_color") {
    if (!input.name) return block.appendDummyInput();
    return block.appendDummyInput()
      .appendField(input.name.toLowerCase())
      .appendField(new FieldColour(input.default || "#000000"), input.name);
  } 
  else if (input.type === "field_dropdown") {
    if (!input.name || !input.options) return block.appendDummyInput();
    
    // Allow options to be a string reference to an options array
    const dropdownOptions = typeof input.options === 'string' ? 
      eval(input.options) : input.options;
      
    return block.appendDummyInput()
      .appendField(input.name.toLowerCase())
      .appendField(new Blockly.FieldDropdown(dropdownOptions), input.name);
  } 
  else if (input.type === "field_number") {
    if (!input.name) return block.appendDummyInput();
    return block.appendDummyInput()
      .appendField(input.name.toLowerCase())
      .appendField(new Blockly.FieldNumber(input.default || 0, input.min, input.max, input.precision || 0), input.name);
  }
  else if (input.type === "statement") {
    if (!input.name) return block.appendDummyInput();
    const statement = block.appendStatementInput(input.name);
    if (input.check) statement.setCheck(input.check);
    if (input.label) statement.appendField(input.label);
    return statement;
  } 
  else if (input.type === "row") {
    const dummyInput = block.appendDummyInput();
    if (!input.children) return dummyInput;
    
    input.children.forEach((child: BlockInputConfig) => {
      if (child.type === "label") {
        dummyInput.appendField(child.text || "");
      } else if (child.type === "field_text") {
        if (child.name) {
          dummyInput.appendField(new Blockly.FieldTextInput(child.default || ""), child.name);
        }
      } else if (child.type === "field_checkbox") {
        if (child.name) {
          dummyInput.appendField(new Blockly.FieldCheckbox(child.checked ? "TRUE" : "FALSE"), child.name);
        }
      } else if (child.type === "field_multiline") {
        if (child.name) {
          dummyInput.appendField(new FieldMultilineInput(child.default || ""), child.name);
        }
      } else if (child.type === "field_color") {
        if (child.name) {
          dummyInput.appendField(new FieldColour(child.default || "#000000"), child.name);
        }
      } else if (child.type === "field_dropdown") {
        if (child.name && child.options) {
          // Handle string reference to options array
          const dropdownOptions = typeof child.options === 'string' ? 
            eval(child.options) : child.options;
          dummyInput.appendField(new Blockly.FieldDropdown(dropdownOptions), child.name);
        }
      } else if (child.type === "field_number") {
        if (child.name) {
          dummyInput.appendField(new Blockly.FieldNumber(child.default || 0, child.min, child.max, child.precision || 0), child.name);
        }
      }
    });
    return dummyInput;
  }
  
  // Default case if none of the above match
  return block.appendDummyInput();
}

// Create block definitions from configuration
function createBlockDefinitions() {
  const definitions: WebBlockDefinitions = {};
  
  Object.values(blockConfigs).forEach((config: BlockConfig) => {
    definitions[config.type] = {
      init: function(this: Blockly.Block) {
        this.setColour(config.color);
        this.setTooltip(config.tooltip);
        this.setHelpUrl(config.helpUrl);
        
        // Process inputs
        config.inputs.forEach((input: BlockInputConfig) => buildInput(this, input));
        
        // Set connections
        if (config.connections.previous) {
          this.setPreviousStatement(true, config.connections.previous);
        }
        if (config.connections.next) {
          this.setNextStatement(true, config.connections.next);
        }
        
        // Special case for web_form_field to handle conditional options field
        if (config.type === 'web_form_field') {
          // Add change listener for TYPE field
          this.setOnChange(function(this: Blockly.Block, changeEvent) {
            if (changeEvent.type === Blockly.Events.BLOCK_CHANGE && 
                'name' in changeEvent && changeEvent.name === 'TYPE') {
              const type = this.getFieldValue('TYPE');
              const needsOptions = type === 'select' || type === 'radio';
              
              // Get the field by name
              const optionsField = this.getField('OPTIONS');
              if (optionsField) {
                // Show/hide based on field type
                optionsField.setVisible(needsOptions);
                
                // Get the parent input of the field and rerender
                const parentInput = optionsField.getParentInput();
                if (parentInput) {
                  parentInput.setVisible(needsOptions);
                  // Blockly will handle rendering automatically
                }
              }
            }
          });
          
          // Initially hide options field if not needed
          const initialType = this.getFieldValue('TYPE');
          const initialNeedsOptions = initialType === 'select' || initialType === 'radio';
          const optionsField = this.getField('OPTIONS');
          if (optionsField) {
            optionsField.setVisible(initialNeedsOptions);
            
            // Get the parent input of the field and set initial visibility
            const parentInput = optionsField.getParentInput();
            if (parentInput) {
              parentInput.setVisible(initialNeedsOptions);
            }
          }
        }

        // Special case for list_query to handle conditional fields
        if (config.type === 'list_query') {
          this.setOnChange(function(this: Blockly.Block, changeEvent) {
            if (changeEvent.type === Blockly.Events.BLOCK_CHANGE && 
                'name' in changeEvent && changeEvent.name === 'QUERY') {
              const query = this.getFieldValue('QUERY');
              
              // Get item input field
              const itemInput = this.getInput('ITEM');
              
              // Configure visibility based on operation
              if (query === 'length' || query === 'empty' || query === 'first' || query === 'last') {
                // These operations don't need an item parameter
                if (itemInput) itemInput.setVisible(false);
              } else {
                // contains and index operations need item parameter
                if (itemInput) itemInput.setVisible(true);
              }
              
              // Set output type based on query
              if (query === 'length' || query === 'index') {
                this.setOutput(true, 'Number');
              } else if (query === 'contains' || query === 'empty') {
                this.setOutput(true, 'Boolean');
              } else {
                this.setOutput(true, null); // any type for first/last
              }
            }
          });
          
          // Set initial visibility based on default query
          const initialQuery = this.getFieldValue('QUERY');
          if (initialQuery === 'length' || initialQuery === 'empty' || 
              initialQuery === 'first' || initialQuery === 'last') {
            const itemInput = this.getInput('ITEM');
            if (itemInput) itemInput.setVisible(false);
          }
          
          // Set initial output type
          if (initialQuery === 'length' || initialQuery === 'index') {
            this.setOutput(true, 'Number');
          } else if (initialQuery === 'contains' || initialQuery === 'empty') {
            this.setOutput(true, 'Boolean');
          } else {
            this.setOutput(true, null);
          }
        }
      }
    };
  });
  
  return definitions;
}

// Export the block definitions
export const webBlocks: WebBlockDefinitions = createBlockDefinitions(); 
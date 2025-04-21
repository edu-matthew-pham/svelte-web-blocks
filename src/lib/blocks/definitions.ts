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
    category: 'component',
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
  }
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
      }
    };
  });
  
  return definitions;
}

// Export the block definitions
export const webBlocks: WebBlockDefinitions = createBlockDefinitions(); 
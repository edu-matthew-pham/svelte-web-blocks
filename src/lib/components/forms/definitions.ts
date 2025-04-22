import { createBlockDefinitions } from '$lib/utils/block-factory.js';
import type { WebBlockConfigs } from '$lib/types.js';

// Define form block configurations
const formsBlockConfigs: WebBlockConfigs = {
  web_basic_form: {
    type: 'web_basic_form',
    category: 'component',
    color: 60,
    tooltip: "Add a form for user input",
    helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form",
    inputs: [
      { type: "row", children: [
        { type: "label", text: "Form" },
        { type: "label", text: "ID" },
        { type: "field_text", name: "ID", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Class" },
        { type: "field_text", name: "CLASS", default: "" }
      ]},
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
      { type: "row", children: [
        { type: "label", text: "Form Field" },
        { type: "label", text: "ID" },
        { type: "field_text", name: "ID", default: "" }
      ]},
      { type: "row", children: [
        { type: "label", text: "Class" },
        { type: "field_text", name: "CLASS", default: "" }
      ]},
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
  }
};

// Create and export the form block definitions
export const formsDefinitions = createBlockDefinitions(formsBlockConfigs); 
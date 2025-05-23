import * as Blockly from 'blockly';
// Import multiline input from plugin package
// Fix imports for multiline input and color field plugins
import * as MultilineInput from '@blockly/field-multilineinput';
import * as ColourField from '@blockly/field-colour';

// Access the field classes directly - these plugins likely export the class as a property
const FieldMultilineInput = MultilineInput.FieldMultilineInput || MultilineInput;
const FieldColour = ColourField.FieldColour || ColourField;
// Import BlockConfig and other needed types from types.ts
import type { BlockConfig, BlockInputConfig, WebBlockDefinitions } from '$lib/types.js';

/// Helper function to capitalize field names nicely
function formatFieldName(name: string): string {
  // Convert names like "BACKGROUND_COLOR" to "Background Color"
  return name.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/// Helper function to build inputs based on configuration
function buildInput(block: Blockly.Block, input: BlockInputConfig) {
  if (input.type === "input_value") {
    if (!input.name) return block.appendDummyInput();
    const valueInput = block.appendValueInput(input.name);
    if (input.check) valueInput.setCheck(input.check);
    if (input.label) valueInput.appendField(input.label);
    if (input.align) valueInput.setAlign(input.align);
    console.log("Creating input value", input.name, input.label, input.align);
    return valueInput;
  } else if (input.type === "label") {
      return block.appendDummyInput().appendField(input.text || "");
    } 
    else if (input.type === "field_text") {
      if (!input.name) return block.appendDummyInput();
      return block.appendDummyInput()
        .appendField(input.label || formatFieldName(input.name))
        .appendField(new Blockly.FieldTextInput(input.default || ""), input.name);
    } 
    else if (input.type === "field_checkbox") {
      if (!input.name) return block.appendDummyInput();
      return block.appendDummyInput()
        .appendField(input.label || formatFieldName(input.name))
        .appendField(new Blockly.FieldCheckbox(input.checked ? "TRUE" : "FALSE"), input.name);
    }
    else if (input.type === "field_multiline") {
      if (!input.name) return block.appendDummyInput();
      return block.appendDummyInput()
        .appendField(input.label || formatFieldName(input.name))
        .appendField(new FieldMultilineInput(input.default || ""), input.name);
    } 
    else if (input.type === "field_color") {
      if (!input.name) return block.appendDummyInput();
      return block.appendDummyInput()
        .appendField(input.label || formatFieldName(input.name))
        .appendField(new FieldColour(input.default || "#000000"), input.name);
    } 
    else if (input.type === "field_dropdown") {
      if (!input.name || !input.options) return block.appendDummyInput();
      
      // Allow options to be a string reference to an options array
      const dropdownOptions = typeof input.options === 'string' ? 
        eval(input.options) : input.options;
        
      return block.appendDummyInput()
        .appendField(input.label || formatFieldName(input.name))
        .appendField(new Blockly.FieldDropdown(dropdownOptions), input.name);
    } 
    else if (input.type === "field_number") {
      if (!input.name) return block.appendDummyInput();
      return block.appendDummyInput()
        .appendField(input.label || formatFieldName(input.name))
        .appendField(new Blockly.FieldNumber(input.default || 0, input.min, input.max, input.precision || 0), input.name);
    }
    else if (input.type === "statement") {
      if (!input.name) return block.appendDummyInput();
      const statement = block.appendStatementInput(input.name);
      if (input.check) statement.setCheck(input.check);
      if (input.label) statement.appendField(input.label);
      return statement;
    } 
    else if (input.type === "field_variable") {
      if (!input.name) return block.appendDummyInput();
      return block.appendDummyInput()
        .appendField(input.label || formatFieldName(input.name))
        .appendField(new Blockly.FieldVariable(input.variable || "item"), input.name);
    }
    else if (input.type === "field_hidden") {
      if (!input.name) return block.appendDummyInput();
      // Create a hidden field that can store data but doesn't display
      const hiddenField = new Blockly.FieldTextInput(input.default || "");
      
      // Add _HIDDEN suffix to the field name so our event listener can identify it
      const fieldName = input.name.endsWith('_HIDDEN') ? input.name : input.name + '_HIDDEN';
      console.log("Creating hidden field", fieldName, input.default);
      
      // Append the field with the _HIDDEN suffix name
      const dummyInput = block.appendDummyInput().appendField(hiddenField, fieldName);
      
      // Set visible false AFTER appending, and use setTimeout to ensure it happens after rendering
      setTimeout(() => {
        hiddenField.setVisible(false);
      }, 0);
      
      return dummyInput;
    }
    else if (input.type === "row") {
      const dummyInput = block.appendDummyInput();
      if (!input.children) return dummyInput;
      
      input.children.forEach((child: BlockInputConfig) => {
        if (child.type === "input_value") {
          // Create a new value input instead of just logging
          if (child.name) {
            const valueInput = block.appendValueInput(child.name);
            if (child.check) valueInput.setCheck(child.check);
            if (child.label) valueInput.appendField(child.label);
            if (child.align) valueInput.setAlign(child.align);
          }
        } else if (child.type === "label") {
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
        } else if (child.type === "field_variable") {
          if (child.name) {
            dummyInput.appendField(new Blockly.FieldVariable(child.variable || "item"), child.name);
          }
        }
      });
      return dummyInput;
    }
    else if (input.type === "combined_input") {
      const dummyInput = block.appendDummyInput();
      if (!input.fields) return dummyInput;
      
      input.fields.forEach((field: BlockInputConfig) => {
        if (field.type === "input_value") {
          // Create a new value input instead of just logging
          if (field.name) {
            const valueInput = block.appendValueInput(field.name);
            if (field.check) valueInput.setCheck(field.check);
            if (field.label) valueInput.appendField(field.label);
            if (field.align) valueInput.setAlign(field.align);
          }
        } else if (field.type === "label") {
          dummyInput.appendField(field.text || "");
        } else if (field.type === "field_text") {
          if (field.name) {
            dummyInput.appendField(new Blockly.FieldTextInput(field.default || ""), field.name);
          }
        } else if (field.type === "field_checkbox") {
          if (field.name) {
            dummyInput.appendField(new Blockly.FieldCheckbox(field.checked ? "TRUE" : "FALSE"), field.name);
          }
        } else if (field.type === "field_multiline") {
          if (field.name) {
            dummyInput.appendField(new FieldMultilineInput(field.default || ""), field.name);
          }
        } else if (field.type === "field_color") {
          if (field.name) {
            dummyInput.appendField(new FieldColour(field.default || "#000000"), field.name);
          }
        } else if (field.type === "field_dropdown") {
          if (field.name && field.options) {
            // Handle string reference to options array
            const dropdownOptions = typeof field.options === 'string' ? 
              eval(field.options) : field.options;
            dummyInput.appendField(new Blockly.FieldDropdown(dropdownOptions), field.name);
          }
        } else if (field.type === "field_number") {
          if (field.name) {
            dummyInput.appendField(new Blockly.FieldNumber(field.default || 0, field.min, field.max, field.precision || 0), field.name);
          }
        } else if (field.type === "field_variable") {
          if (field.name) {
            dummyInput.appendField(new Blockly.FieldVariable(field.variable || "item"), field.name);
          }
        }
      });
      return dummyInput;
    }
    else if (input.type === "input_value") {
      if (!input.name) return block.appendDummyInput();
      const valueInput = block.appendValueInput(input.name);
      if (input.check) valueInput.setCheck(input.check);
      if (input.label) valueInput.appendField(input.label);
      if (input.align) valueInput.setAlign(input.align);
      console.log("Creating input value", input.name, input.label, input.align);
      return valueInput;
    }
    
    // Default case if none of the above match
    return block.appendDummyInput();
  }
  
  // Create block definitions from configuration
  function createBlockDefinitions(blockConfigs: Record<string, BlockConfig>): WebBlockDefinitions {
    const definitions: WebBlockDefinitions = {};
    
    Object.entries(blockConfigs).forEach(([type, config]) => {
      definitions[type] = {
        init: function(this: Blockly.BlockSvg) {
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
          if (config.connections.output) {
            this.setOutput(true, config.connections.output);
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

          //  ── new: apply any extensions listed in the config ──
          if (Array.isArray((config as any).extensions)) {
            (config as any).extensions.forEach((extName: string) => {
              Blockly.Extensions.apply(extName, this, false);
            });
          }
        },
        // Store the original block config for reference
        blockConfig: config,
        // Pass through the schema if it exists
        schema: config.schema
      };
    });
    
    return definitions;
  }
  
  // Export the block definitions
  export { createBlockDefinitions };

  // Add this near the top of the file with other constants
export const COMMON_ICONS: [string, string][] = [
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
    ["�� Chat", "💬"]
  ];
import { createFormHTML, createFormFieldHTML } from '$lib/blocks/htmlTemplates.js';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

// Create generators for form components
export const formsGenerators = {
  web_basic_form: {
    html: function(block: Blockly.Block) {
      const title = block.getFieldValue('TITLE');
      const submitText = block.getFieldValue('SUBMIT_TEXT');
      const fields = javascriptGenerator.statementToCode(block, 'FIELDS');
      
      // Extract ID and CLASS values
      const id = block.getFieldValue('ID') || '';
      const className = block.getFieldValue('CLASS') || '';
      
      const attributes = { id, className };
      
      return createFormHTML(
        title,
        submitText,
        fields,
        attributes
      );
    },
    
    highLevel: function(block: Blockly.Block) {
      const title = block.getFieldValue('TITLE');
      const submitText = block.getFieldValue('SUBMIT_TEXT');
      
      // Process form fields
      const children = [];
      let fieldBlock = block.getInputTargetBlock('FIELDS');
      while (fieldBlock) {
        const field = javascriptGenerator.blockToHighLevel(fieldBlock);
        if (field) children.push(field);
        fieldBlock = fieldBlock.getNextBlock();
      }
      
      return {
        type: "form",
        properties: {
          title,
          submitText,
          id: block.getFieldValue('ID'),
          className: block.getFieldValue('CLASS')
        },
        children: children
      };
    }
  },
  
  web_form_field: {
    html: function(block: Blockly.Block): string {
      const label = block.getFieldValue('LABEL');
      const type = block.getFieldValue('TYPE');
      const required = block.getFieldValue('REQUIRED') === 'TRUE';
      const optionsString = block.getFieldValue('OPTIONS');
      
      // Extract ID and CLASS values
      const id = block.getFieldValue('ID') || '';
      const className = block.getFieldValue('CLASS') || '';
      
      // Create attributes object
      const attributes = {
        id: id,
        className: className
      };
      
      // For select or radio fields, process the options
      let parsedOptions = [];
      if (type === 'select' || type === 'radio') {
        parsedOptions = optionsString.split(',').map((opt: string) => opt.trim());
      }
      
      // Generate a sanitized ID from the label if no custom ID provided
      const fieldId = id || `field-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      
      return createFormFieldHTML(fieldId, label, type, required, parsedOptions, attributes);
    },
    
    highLevel: function(block: Blockly.Block): any {
      const type = block.getFieldValue('TYPE');
      const required = block.getFieldValue('REQUIRED') === 'TRUE';
      const options = type === 'select' || type === 'radio' ? 
        block.getFieldValue('OPTIONS').split(',').map((opt: string) => opt.trim()) : 
        [];
      
      return {
        type: "form_field",
        properties: {
          label: block.getFieldValue('LABEL'),
          fieldType: type,
          required: required,
          options: options,
          id: block.getFieldValue('ID'),
          className: block.getFieldValue('CLASS')
        }
      };
    }
  }
}; 
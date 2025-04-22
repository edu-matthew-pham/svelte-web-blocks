import { createGenerator } from '$lib/utils/generator-factory.js';
import { createFormHTML, createFormFieldHTML } from '$lib/blocks/htmlTemplates.js';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

// Create generators for form components
export const formsGenerators = {
  web_basic_form: createGenerator({
    propertyMappings: [
      { componentProp: 'title' },
      { componentProp: 'submitText' },
      { componentProp: 'id' },
      { componentProp: 'className' }
    ],
    childInputs: [
      { inputName: 'FIELDS' }
    ],
    
    // Custom HTML renderer that uses the existing template
    htmlRenderer: (props, childrenHtml, attributes) => {
      const { title, submitText } = props;
      
      return createFormHTML(
        title,
        submitText,
        childrenHtml.fields || '',
        attributes
      );
    }
  }),
  
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

      console.log('Attributes', attributes);
      
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
        type: "formField",
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
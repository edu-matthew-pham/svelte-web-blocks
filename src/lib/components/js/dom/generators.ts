import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import * as jsTemplates from '$lib/blocks/jsTemplates.js';
import type { WebBlockGeneratorFunctions } from '$lib/types.js';

/**
 * DOM block generators
 */
export const jsDomGenerators: WebBlockGeneratorFunctions = {
  // Select element generator
  js_select_element: {
    html: function(block: Blockly.Block) {
      const selector = block.getFieldValue('SELECTOR');
      const variable = block.getFieldValue('VARIABLE');
      
      return `const ${variable} = document.querySelector('${selector}');`;
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: 'dom_select',
        properties: {
          selector: block.getFieldValue('SELECTOR'),
          variable: block.getFieldValue('VARIABLE')
        },
        attributes: {}
      };
    }
  },
  
  // Element property generator
  js_element_property: {
    html: function(block: Blockly.Block) {
      const action = block.getFieldValue('ACTION');
      const element = block.getFieldValue('ELEMENT');
      const propertyType = block.getFieldValue('PROPERTY_TYPE');
      const property = block.getFieldValue('PROPERTY');
      const value = block.getFieldValue('VALUE');
      const isExpression = block.getFieldValue('IS_EXPRESSION') === 'TRUE';
      const loggingLevel = block.getFieldValue('LOGGING_LEVEL');
      
      const elementCode = `document.getElementById('${element}')`;
      
      return jsTemplates.elementProperty(elementCode, action, propertyType, property, value, isExpression, loggingLevel);
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: 'dom_property',
        properties: {
          action: block.getFieldValue('ACTION'),
          element: block.getFieldValue('ELEMENT'),
          propertyType: block.getFieldValue('PROPERTY_TYPE'),
          property: block.getFieldValue('PROPERTY'),
          value: block.getFieldValue('VALUE'),
          isExpression: block.getFieldValue('IS_EXPRESSION') === 'TRUE',
          loggingLevel: block.getFieldValue('LOGGING_LEVEL')
        },
        attributes: {}
      };
    }
  },
  
  // Element class generator
  js_element_class: {
    html: function(block: Blockly.Block) {
      const action = block.getFieldValue('ACTION');
      const element = block.getFieldValue('ELEMENT');
      const className = block.getFieldValue('CLASS');
      
      return jsTemplates.elementClass(element, action, className);
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: 'dom_class',
        properties: {
          action: block.getFieldValue('ACTION'),
          element: block.getFieldValue('ELEMENT'),
          className: block.getFieldValue('CLASS')
        },
        attributes: {}
      };
    }
  },
  
  // Event handler generator
  js_event_handler: {
    html: function(block: Blockly.Block) {
      const element = block.getFieldValue('ELEMENT');
      const event = block.getFieldValue('EVENT');
      const preventDefault = block.getFieldValue('PREVENT_DEFAULT');
      const handler = javascriptGenerator.statementToCode(block, 'HANDLER');
      
      return jsTemplates.eventHandler(element, event, handler, { preventDefault });
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: 'dom_event',
        properties: {
          element: block.getFieldValue('ELEMENT'),
          event: block.getFieldValue('EVENT'),
          preventDefault: block.getFieldValue('PREVENT_DEFAULT') === 'TRUE',
          handler: 'HANDLER_CODE'
        },
        attributes: {}
      };
    }
  },
  
  js_modify_element: {
    html: function(block: Blockly.Block) {
      const element = block.getFieldValue('ELEMENT');
      const isVariable = block.getFieldValue('IS_VARIABLE') === 'TRUE';
      const action = block.getFieldValue('ACTION');
      const property = block.getFieldValue('PROPERTY');
      const value = block.getFieldValue('VALUE');
      
      return jsTemplates.modifyElement(element, isVariable, action, property, value);
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: 'dom_modify',
        properties: {
          element: block.getFieldValue('ELEMENT'),
          isVariable: block.getFieldValue('IS_VARIABLE') === 'TRUE',
          action: block.getFieldValue('ACTION'),
          property: block.getFieldValue('PROPERTY'),
          value: block.getFieldValue('VALUE')
        },
        attributes: {}
      };
    }
  },
  
  js_delete_element: {
    html: function(block: Blockly.Block) {
      const element = block.getFieldValue('ELEMENT');
      const isVariable = block.getFieldValue('IS_VARIABLE') === 'TRUE';
      
      return jsTemplates.deleteElement(element, isVariable);
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: 'dom_delete',
        properties: {
          element: block.getFieldValue('ELEMENT'),
          isVariable: block.getFieldValue('IS_VARIABLE') === 'TRUE'
        },
        attributes: {}
      };
    }
  },
  
  js_clone_element: {
    html: function(block: Blockly.Block) {
      const source = block.getFieldValue('SOURCE');
      const newId = block.getFieldValue('NEW_ID');
      const deep = block.getFieldValue('DEEP') === 'TRUE';
      const container = block.getFieldValue('CONTAINER');
      
      return jsTemplates.cloneElement(source, newId, deep, container);
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: 'dom_clone',
        properties: {
          source: block.getFieldValue('SOURCE'),
          newId: block.getFieldValue('NEW_ID'),
          deep: block.getFieldValue('DEEP') === 'TRUE',
          container: block.getFieldValue('CONTAINER')
        },
        attributes: {}
      };
    }
  }
}

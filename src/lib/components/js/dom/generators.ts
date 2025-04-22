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
        selector: block.getFieldValue('SELECTOR'),
        variable: block.getFieldValue('VARIABLE')
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
        action: block.getFieldValue('ACTION'),
        element: block.getFieldValue('ELEMENT'),
        propertyType: block.getFieldValue('PROPERTY_TYPE'),
        property: block.getFieldValue('PROPERTY'),
        value: block.getFieldValue('VALUE'),
        loggingLevel: block.getFieldValue('LOGGING_LEVEL')
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
        action: block.getFieldValue('ACTION'),
        element: block.getFieldValue('ELEMENT'),
        className: block.getFieldValue('CLASS')
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
        element: block.getFieldValue('ELEMENT'),
        event: block.getFieldValue('EVENT'),
        preventDefault: block.getFieldValue('PREVENT_DEFAULT') === 'TRUE',
        handler: 'HANDLER_CODE'
      };
    }
  },
  
  // Create element generator
  js_create_element: {
    html: function(block: Blockly.Block) {
      const tag = block.getFieldValue('TAG');
      const variable = block.getFieldValue('VARIABLE');
      
      return `const ${variable} = document.createElement('${tag}');`;
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: 'dom_create',
        tag: block.getFieldValue('TAG'),
        variable: block.getFieldValue('VARIABLE')
      };
    }
  },
  
  // Tree operation generator
  js_tree_operation: {
    html: function(block: Blockly.Block) {
      const action = block.getFieldValue('ACTION');
      const child = block.getFieldValue('CHILD');
      const parent = block.getFieldValue('PARENT');
      
      return jsTemplates.treeOperation(action, parent, child);
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: 'dom_tree',
        action: block.getFieldValue('ACTION'),
        child: block.getFieldValue('CHILD'),
        parent: block.getFieldValue('PARENT')
      };
    }
  },
  
  // Iterate data generator
  js_iterate_data: {
    html: function(block: Blockly.Block) {
      const dataSource = block.getFieldValue('DATA_SOURCE');
      const container = block.getFieldValue('CONTAINER');
      const elementType = block.getFieldValue('ELEMENT_TYPE');
      const template = block.getFieldValue('TEMPLATE');
      
      return jsTemplates.iterateData(dataSource, container, elementType, template);
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: 'dom_iterate',
        dataSource: block.getFieldValue('DATA_SOURCE'),
        container: block.getFieldValue('CONTAINER'),
        elementType: block.getFieldValue('ELEMENT_TYPE'),
        template: block.getFieldValue('TEMPLATE')
      };
    }
  },
  
  // Populate table generator
  js_populate_table: {
    html: function(block: Blockly.Block) {
      const dataSource = block.getFieldValue('DATA_SOURCE');
      const table = block.getFieldValue('TABLE');
      const columns = block.getFieldValue('COLUMNS');
      const headers = block.getFieldValue('HEADERS') === true;
      
      return jsTemplates.populateTable(dataSource, table, columns.split(','), headers);
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: 'dom_table',
        dataSource: block.getFieldValue('DATA_SOURCE'),
        table: block.getFieldValue('TABLE'),
        columns: block.getFieldValue('COLUMNS').split(','),
        headers: block.getFieldValue('HEADERS') === true
      };
    }
  },
  
  // Template generator
  js_create_from_template: {
    html: function(block: Blockly.Block) {
      const template = block.getFieldValue('TEMPLATE');
      const dataSource = block.getFieldValue('DATA_SOURCE');
      const container = block.getFieldValue('CONTAINER');
      
      return jsTemplates.createFromTemplate(template, dataSource, container);
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: 'dom_template',
        template: block.getFieldValue('TEMPLATE'),
        dataSource: block.getFieldValue('DATA_SOURCE'),
        container: block.getFieldValue('CONTAINER')
      };
    }
  }
}; 
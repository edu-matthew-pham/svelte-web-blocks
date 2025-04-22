import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import * as jsTemplates from '$lib/blocks/jsTemplates.js';
import type { WebBlockGeneratorFunctions } from '$lib/types.js';

/**
 * DOM Element Creation block generators
 */
export const jsCreateGenerators: WebBlockGeneratorFunctions = {
  // Container Elements (div, section, form, etc.)
  js_create_container: {
    html: function(block: Blockly.Block) {
      const tagName = block.getFieldValue('TAG');
      const id = block.getFieldValue('ID');
      const className = block.getFieldValue('CLASS');
      const container = block.getFieldValue('CONTAINER');
      const contentType = block.getFieldValue('CONTENT_TYPE');
      const content = block.getFieldValue('CONTENT');
      
      return jsTemplates.createContainerElement(tagName, id, className, container, contentType, content);
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: 'create_container',
        tag: block.getFieldValue('TAG'),
        id: block.getFieldValue('ID'),
        class: block.getFieldValue('CLASS'),
        container: block.getFieldValue('CONTAINER'),
        contentType: block.getFieldValue('CONTENT_TYPE'),
        content: block.getFieldValue('CONTENT')
      };
    }
  },
  
  // Interactive Elements (button, input, img, etc.)
  js_create_interactive: {
    html: function(block: Blockly.Block) {
      const tagType = block.getFieldValue('TAG');
      const id = block.getFieldValue('ID');
      const className = block.getFieldValue('CLASS');
      const labelText = block.getFieldValue('LABEL');
      const container = block.getFieldValue('CONTAINER');
      const attributesJson = block.getFieldValue('ATTRIBUTES');
      
      return jsTemplates.createInteractiveElement(tagType, id, className, labelText, container, attributesJson);
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: 'create_interactive',
        tag: block.getFieldValue('TAG'),
        id: block.getFieldValue('ID'),
        class: block.getFieldValue('CLASS'),
        label: block.getFieldValue('LABEL'),
        container: block.getFieldValue('CONTAINER'),
        attributes: block.getFieldValue('ATTRIBUTES')
      };
    }
  },
  
  // Text Elements (headings, paragraphs, links, etc.)
  js_create_text: {
    html: function(block: Blockly.Block) {
      const tagName = block.getFieldValue('TAG');
      const id = block.getFieldValue('ID');
      const className = block.getFieldValue('CLASS');
      const content = block.getFieldValue('CONTENT');
      const container = block.getFieldValue('CONTAINER');
      const href = block.getFieldValue('HREF');
      
      return jsTemplates.createTextElement(tagName, id, className, content, container, href);
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: 'create_text',
        tag: block.getFieldValue('TAG'),
        id: block.getFieldValue('ID'),
        class: block.getFieldValue('CLASS'),
        content: block.getFieldValue('CONTENT'),
        container: block.getFieldValue('CONTAINER'),
        href: block.getFieldValue('HREF')
      };
    }
  },
  
  // Hierarchical/Data Elements (tables, lists, etc.)
  js_create_structured: {
    html: function(block: Blockly.Block) {
      const structureType = block.getFieldValue('STRUCTURE_TYPE');
      const id = block.getFieldValue('ID');
      const className = block.getFieldValue('CLASS');
      const container = block.getFieldValue('CONTAINER');
      const dataSource = block.getFieldValue('DATA_SOURCE');
      const itemTemplate = block.getFieldValue('ITEM_TEMPLATE');
      const items = block.getFieldValue('ITEMS');
      
      return jsTemplates.createStructuredElement(structureType, id, className, container, dataSource, itemTemplate, items);
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: 'create_structured',
        structureType: block.getFieldValue('STRUCTURE_TYPE'),
        id: block.getFieldValue('ID'),
        class: block.getFieldValue('CLASS'),
        container: block.getFieldValue('CONTAINER'),
        dataSource: block.getFieldValue('DATA_SOURCE'),
        itemTemplate: block.getFieldValue('ITEM_TEMPLATE'),
        items: block.getFieldValue('ITEMS')
      };
    }
  },

  // Structured Item Creation (li, tr, td, option, etc.)
  js_create_structured_item: {
    html: function(block: Blockly.Block) {
      const itemType = block.getFieldValue('ITEM_TYPE');
      const id = block.getFieldValue('ID');
      const className = block.getFieldValue('CLASS');
      const container = block.getFieldValue('CONTAINER');
      const contentType = block.getFieldValue('CONTENT_TYPE');
      const content = block.getFieldValue('CONTENT');
      const optionValues = block.getFieldValue('OPTION_VALUES');
      const separator = block.getFieldValue('SEPARATOR');
      const attributesJson = block.getFieldValue('ATTRIBUTES');
      
      // Parse attributes JSON
      let attributes = {};
      try {
        if (attributesJson && attributesJson.trim() !== '{}' && attributesJson.trim() !== '') {
          attributes = JSON.parse(attributesJson);
        }
      } catch (e) {
        console.error('Invalid JSON in attributes', e);
      }
      
      return jsTemplates.createStructuredItem(
        itemType, id, className, container, contentType, 
        content, optionValues, separator, attributes
      );
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: 'create_structured_item',
        itemType: block.getFieldValue('ITEM_TYPE'),
        id: block.getFieldValue('ID'),
        class: block.getFieldValue('CLASS'),
        container: block.getFieldValue('CONTAINER'),
        contentType: block.getFieldValue('CONTENT_TYPE'),
        content: block.getFieldValue('CONTENT'),
        optionValues: block.getFieldValue('OPTION_VALUES'),
        separator: block.getFieldValue('SEPARATOR'),
        attributes: block.getFieldValue('ATTRIBUTES')
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
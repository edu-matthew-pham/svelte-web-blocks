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
        properties: {
          tag: block.getFieldValue('TAG'),
          container: block.getFieldValue('CONTAINER'),
          contentType: block.getFieldValue('CONTENT_TYPE'),
          content: block.getFieldValue('CONTENT')
        },
        attributes: {
          id: block.getFieldValue('ID'),
          className: block.getFieldValue('CLASS')
        }
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
        properties: {
          tag: block.getFieldValue('TAG'),
          label: block.getFieldValue('LABEL'),
          container: block.getFieldValue('CONTAINER'),
          attributesJson: block.getFieldValue('ATTRIBUTES')
        },
        attributes: {
          id: block.getFieldValue('ID'),
          className: block.getFieldValue('CLASS')
        }
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
        properties: {
          tag: block.getFieldValue('TAG'),
          content: block.getFieldValue('CONTENT'),
          container: block.getFieldValue('CONTAINER'),
          href: block.getFieldValue('HREF')
        },
        attributes: {
          id: block.getFieldValue('ID'),
          className: block.getFieldValue('CLASS')
        }
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
      const items = block.getFieldValue('ITEMS');
      
      return jsTemplates.createStructuredElement(structureType, id, className, container, dataSource, items);
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: 'create_structured',
        properties: {
          structureType: block.getFieldValue('STRUCTURE_TYPE'),
          container: block.getFieldValue('CONTAINER'),
          dataSource: block.getFieldValue('DATA_SOURCE'),
          items: block.getFieldValue('ITEMS')
        },
        attributes: {
          id: block.getFieldValue('ID'),
          className: block.getFieldValue('CLASS')
        }
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
        properties: {
          itemType: block.getFieldValue('ITEM_TYPE'),
          container: block.getFieldValue('CONTAINER'),
          contentType: block.getFieldValue('CONTENT_TYPE'),
          content: block.getFieldValue('CONTENT'),
          optionValues: block.getFieldValue('OPTION_VALUES'),
          separator: block.getFieldValue('SEPARATOR'),
          attributesJson: block.getFieldValue('ATTRIBUTES')
        },
        attributes: {
          id: block.getFieldValue('ID'),
          className: block.getFieldValue('CLASS')
        }
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
        properties: {
          tag: block.getFieldValue('TAG'),
          variable: block.getFieldValue('VARIABLE')
        },
        attributes: {}
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
        properties: {
          action: block.getFieldValue('ACTION'),
          child: block.getFieldValue('CHILD'),
          parent: block.getFieldValue('PARENT')
        },
        attributes: {}
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
        properties: {
          dataSource: block.getFieldValue('DATA_SOURCE'),
          container: block.getFieldValue('CONTAINER'),
          elementType: block.getFieldValue('ELEMENT_TYPE'),
          template: block.getFieldValue('TEMPLATE')
        },
        attributes: {}
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
        properties: {
          dataSource: block.getFieldValue('DATA_SOURCE'),
          table: block.getFieldValue('TABLE'),
          columns: block.getFieldValue('COLUMNS').split(','),
          headers: block.getFieldValue('HEADERS') === true
        },
        attributes: {}
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
        properties: {
          template: block.getFieldValue('TEMPLATE'),
          dataSource: block.getFieldValue('DATA_SOURCE'),
          container: block.getFieldValue('CONTAINER')
        },
        attributes: {}
      };
    }
  }
}; 
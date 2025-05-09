import * as Blockly from 'blockly';

// Create generators for custom code components
export const customGenerators = {
  custom_content_html: {
    html: function(block: Blockly.Block): string {
      const htmlCode = block.getFieldValue('CODE');
      const id = block.getFieldValue('ID') || '';
      const className = block.getFieldValue('CLASS') || '';
      
      // Create a wrapper div if ID or CLASS is provided
      if (id || className) {
        const idAttr = id ? ` id="${id}"` : '';
        const classAttr = className ? ` class="${className}"` : '';
        return `<div${idAttr}${classAttr}>\n${htmlCode}\n</div>`;
      }
      
      // Otherwise just return the raw HTML
      return htmlCode;
    },
    
    highLevel: function(block: Blockly.Block): any {
      return {
        type: "custom_html",
        properties: {
          code: block.getFieldValue('CODE'),
          id: block.getFieldValue('ID'),
          className: block.getFieldValue('CLASS')
        }
      };
    }
  },
  
  custom_style_css: {
    html: function(block: Blockly.Block): string {
      // Simply return the CSS code
      return block.getFieldValue('CODE');
    },
    
    highLevel: function(block: Blockly.Block): any {
      return {
        type: "custom_css",
        properties: {
          code: block.getFieldValue('CODE')
        }
      };
    }
  },
  
  custom_script_js: {
    html: function(block: Blockly.Block): string {
      // Simply return the JavaScript code
      return block.getFieldValue('CODE');
    },
    
    highLevel: function(block: Blockly.Block): any {
      return {
        type: "custom_javascript",
        properties: {
          code: block.getFieldValue('CODE')
        }
      };
    }
  },
  
  custom_onload_js: {
    html: function(block: Blockly.Block): string {
      const code = block.getFieldValue('CODE');
      
    // Simply return the JavaScript code
    return block.getFieldValue('CODE');
    },
    
    highLevel: function(block: Blockly.Block): any {
      return {
        type: "custom_onload_javascript",
        properties: {
          code: block.getFieldValue('CODE')
        }
      };
    }
  }
    
}; 
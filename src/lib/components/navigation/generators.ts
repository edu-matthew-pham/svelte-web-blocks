import * as HTML from '$lib/blocks/htmlTemplates.js';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

// Create navigation generators
export const navigationGenerators = {
  // Header generator
  web_header: {
    html: function(block: Blockly.Block) {
      const logoText = block.getFieldValue('LOGO_TEXT');
      const includeSignup = block.getFieldValue('INCLUDE_SIGNUP') === 'TRUE';
      const navigationItems = javascriptGenerator.statementToCode(block, 'LINKS');
      
      // Get ID and CLASS values
      const id = block.getFieldValue('ID') || '';
      const className = block.getFieldValue('CLASS') || '';
      
      const attributes = { id, className };
      
      return HTML.createHeaderHTML(logoText, includeSignup, navigationItems, attributes) + '\n';
    },
    
    highLevel: function(block: Blockly.Block) {
      const logoText = block.getFieldValue('LOGO_TEXT');
      const includeSignup = block.getFieldValue('INCLUDE_SIGNUP') === 'TRUE';
      
      // Process navigation items
      const children = [];
      let navBlock = block.getInputTargetBlock('LINKS');
      while (navBlock) {
        const navItem = javascriptGenerator.blockToHighLevel(navBlock);
        if (navItem) children.push(navItem);
        navBlock = navBlock.getNextBlock();
      }
      
      return {
        type: "header",
        properties: {
          logoText,
          includeSignup
        },
        children: children
      };
    }
  },
  
  // Navigation item generator
  web_nav_item: {
    html: function(block: Blockly.Block) {
      const text = block.getFieldValue('TEXT');
      const url = block.getFieldValue('URL');
      
      // Get ID and CLASS values
      const id = block.getFieldValue('ID') || '';
      const className = block.getFieldValue('CLASS') || '';
      
      const attributes = { id, className };
      
      return HTML.createNavItemHTML(text, url, attributes);
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: "nav_item",
        properties: {
          text: block.getFieldValue('TEXT'),
          url: block.getFieldValue('URL')
        }
      };
    }
  }
}; 
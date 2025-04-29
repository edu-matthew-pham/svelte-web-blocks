import { createFooterHTML, createFooterLinkHTML } from '$lib/blocks/htmlTemplates.js';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

// Create generators for footer components
export const footerGenerators = {
  web_footer: {
    html: function(block: Blockly.Block) {
      const copyright = block.getFieldValue('COPYRIGHT');
      const links = javascriptGenerator.statementToCode(block, 'LINKS');
      
      // Get ID and CLASS values
      const id = block.getFieldValue('ID') || '';
      const className = block.getFieldValue('CLASS') || '';
      
      const attributes = { id, className };
      
      return createFooterHTML(
        copyright,
        links,
        attributes
      );
    },
    
    highLevel: function(block: Blockly.Block) {
      const copyright = block.getFieldValue('COPYRIGHT');
      
      // Process footer links
      const children = [];
      let linkBlock = block.getInputTargetBlock('LINKS');
      while (linkBlock) {
        const link = javascriptGenerator.blockToHighLevel(linkBlock);
        if (link) children.push(link);
        linkBlock = linkBlock.getNextBlock();
      }
      
      return {
        type: "footer",
        properties: {
          copyright
        },
        children: children
      };
    }
  },
  
  web_footer_link: {
    html: function(block: Blockly.Block) {
      const text = block.getFieldValue('TEXT');
      const url = block.getFieldValue('URL');
      
      // Get ID and CLASS values
      const id = block.getFieldValue('ID') || '';
      const className = block.getFieldValue('CLASS') || '';
      
      const attributes = { id, className };
      
      return createFooterLinkHTML(text, url, attributes);
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: "footer_link",
        properties: {
          text: block.getFieldValue('TEXT'),
          url: block.getFieldValue('URL')
        }
      };
    }
  }
}; 
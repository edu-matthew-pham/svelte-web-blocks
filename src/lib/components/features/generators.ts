import { createFeatureCardsHTML, createFeatureCardHTML } from '$lib/blocks/htmlTemplates.js';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

// Create generators for feature components
export const featuresGenerators = {
  web_feature_cards: {
    html: function(block: Blockly.Block): string {
      const title = block.getFieldValue('TITLE');
      const columns = block.getFieldValue('COLUMNS');
      const backgroundColor = block.getFieldValue('BACKGROUND_COLOR') || '#ffffff';
      const cards = javascriptGenerator.statementToCode(block, 'CARDS');
      
      // Get ID and CLASS values
      const id = block.getFieldValue('ID') || '';
      const className = block.getFieldValue('CLASS') || '';
      
      const attributes = { id, className };
      
      return createFeatureCardsHTML(
        title,
        backgroundColor,
        cards,
        attributes
      );
    },
    
    highLevel: function(block: Blockly.Block): any {
      const title = block.getFieldValue('TITLE');
      const columns = block.getFieldValue('COLUMNS');
      const backgroundColor = block.getFieldValue('BACKGROUND_COLOR') || '#ffffff';
      
      // Process feature cards
      const children = [];
      let cardBlock = block.getInputTargetBlock('CARDS');
      while (cardBlock) {
        const card = javascriptGenerator.blockToHighLevel(cardBlock);
        if (card) children.push(card);
        cardBlock = cardBlock.getNextBlock();
      }
      
      return {
        type: "feature_cards",
        properties: {
          title,
          columns,
          backgroundColor
        },
        children: children
      };
    }
  },
  
  // For feature_card, we need custom implementation to handle column settings from parent
  web_feature_card: {
    html: function(block: Blockly.Block): string {
      const icon = block.getFieldValue('ICON');
      const title = block.getFieldValue('TITLE');
      const description = block.getFieldValue('DESCRIPTION');
      
      // Get parent block's column setting
      let columns = 3; // Default to 3 columns
      const parent = block.getSurroundParent();
      if (parent && parent.type === 'web_feature_cards') {
        columns = parseInt(parent.getFieldValue('COLUMNS'));
      }
      
      // Extract ID and CLASS values
      const id = block.getFieldValue('ID') || '';
      const className = block.getFieldValue('CLASS') || '';
      
      // Create attributes object
      const attributes = {
        id: id,
        className: className
      };
      
      return createFeatureCardHTML(icon, title, description, columns, attributes);
    },
    
    highLevel: function(block: Blockly.Block): any {
      return {
        type: "feature_card",
        properties: {
          icon: block.getFieldValue('ICON'),
          title: block.getFieldValue('TITLE'),
          description: block.getFieldValue('DESCRIPTION'),
          id: block.getFieldValue('ID'),
          className: block.getFieldValue('CLASS')
        }
      };
    }
  }
}; 
import * as HTML from '$lib/blocks/htmlTemplates.js';
import * as Blockly from 'blockly';

// Create generators for hero component
export const heroGenerators = {
  web_hero: {
    html: function(block: Blockly.Block) {
      const headline = block.getFieldValue('HEADLINE');
      const subheadline = block.getFieldValue('SUBHEADLINE');
      const buttonText = block.getFieldValue('BUTTON_TEXT');
      const buttonUrl = block.getFieldValue('BUTTON_URL');
      const hasImage = block.getFieldValue('HAS_IMAGE') === 'TRUE';
      const imageUrl = block.getFieldValue('IMAGE_URL');
      
      // Get ID and CLASS values
      const id = block.getFieldValue('ID') || '';
      const className = block.getFieldValue('CLASS') || '';
      
      const attributes = { id, className };
      
      return HTML.createHeroHTML(
        headline,
        subheadline,
        buttonText,
        buttonUrl,
        hasImage,
        imageUrl,
        attributes
      );
    },
    
    highLevel: function(block: Blockly.Block) {
      return {
        type: "hero",
        properties: {
          headline: block.getFieldValue('HEADLINE'),
          subheadline: block.getFieldValue('SUBHEADLINE'),
          buttonText: block.getFieldValue('BUTTON_TEXT'),
          buttonUrl: block.getFieldValue('BUTTON_URL'),
          hasImage: block.getFieldValue('HAS_IMAGE') === 'TRUE',
          imageUrl: block.getFieldValue('IMAGE_URL')
        }
      };
    }
  }
}; 
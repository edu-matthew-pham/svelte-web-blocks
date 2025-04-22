import { createGenerator } from '$lib/utils/generator-factory.js';
import { createFeatureCardsHTML, createFeatureCardHTML } from '$lib/blocks/htmlTemplates.js';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

// Create generators for feature components
export const featuresGenerators = {
  web_feature_cards: createGenerator({
    propertyMappings: [
      { componentProp: 'title' },
      { componentProp: 'columns' },
      // Note: If you're missing a backgroundColor field in your definition,
      // you might need to add it or handle its absence in the htmlRenderer
    ],
    childInputs: [
      { inputName: 'CARDS' }
    ],
    
    // Custom HTML renderer that uses the existing template
    htmlRenderer: (props, childrenHtml, attributes) => {
      const { title, columns } = props;
      const backgroundColor = props.backgroundColor || '#ffffff';
      
      return createFeatureCardsHTML(
        title,
        backgroundColor,
        childrenHtml.cards || '',
        attributes
      );
    }
  }),
  
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
        type: "featureCard",
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
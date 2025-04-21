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
    htmlRenderer: (props, childrenHtml) => {
      const { title, columns } = props;
      const backgroundColor = props.backgroundColor || '#ffffff';
      
      return createFeatureCardsHTML(
        title,
        backgroundColor,
        childrenHtml.cards || ''
      );
    }
  }),
  
  web_feature_card: createGenerator({
    propertyMappings: [
      { componentProp: 'icon' },
      { componentProp: 'title' },
      { componentProp: 'description' }
    ],
    
    // Custom HTML renderer that uses the existing template
    htmlRenderer: (props, childrenHtml) => {
      const { icon, title, description } = props;
      
      // Get parent block's column setting
      let columns = 3; // Default to 3 columns
      
      // Note: This requires access to the block, which isn't available in the factory
      // We'll need to implement a different approach or use a block reference
      
      return createFeatureCardHTML(
        icon,
        title,
        description,
        columns
      );
    }
  })
};

// Override the HTML generator for feature card to access parent block
featuresGenerators.web_feature_card.html = function(block: Blockly.Block): string {
  const icon = block.getFieldValue('ICON');
  const title = block.getFieldValue('TITLE');
  const description = block.getFieldValue('DESCRIPTION');
  
  // Get parent block's column setting
  let columns = 3; // Default to 3 columns
  const parent = block.getSurroundParent();
  if (parent && parent.type === 'web_feature_cards') {
    columns = parseInt(parent.getFieldValue('COLUMNS'));
  }
  
  return createFeatureCardHTML(icon, title, description, columns);
}; 
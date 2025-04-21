import { createGenerator } from '$lib/utils/generator-factory.js';
import { createContentSectionHTML, createContentBlockHTML } from '$lib/blocks/htmlTemplates.js';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { marked } from 'marked';

// Create generators for content components
export const contentGenerators = {
  web_content_section: createGenerator({
    propertyMappings: [
      { componentProp: 'headline' },
      { componentProp: 'columns' }
    ],
    childInputs: [
      { inputName: 'CONTENT_BLOCKS' }
    ],
    
    // Custom HTML renderer that uses the existing template
    htmlRenderer: (props, childrenHtml) => {
      const { headline } = props;
      
      return createContentSectionHTML(
        headline,
        childrenHtml.content_blocks || ''
      );
    }
  }),
  
  // For content_block, we'll need custom implementation to handle markdown conversion
  web_content_block: {
    html: function(block: Blockly.Block): string {
      const markdownContent = block.getFieldValue('CONTENT');
      // Force synchronous operation with marked
      const htmlContent = marked.parse(markdownContent, { async: false }) as string;
      
      // Get parent block's column setting
      let columns = 1; // Default to 1 column
      const parent = block.getSurroundParent();
      if (parent && parent.type === 'web_content_section') {
        columns = parseInt(parent.getFieldValue('COLUMNS'));
      }
      
      return createContentBlockHTML(htmlContent, columns);
    },
    
    highLevel: function(block: Blockly.Block): any {
      return {
        type: "contentBlock",
        properties: {
          content: block.getFieldValue('CONTENT')
        }
      };
    }
  }
}; 
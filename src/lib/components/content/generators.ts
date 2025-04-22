import { createGenerator } from '$lib/utils/generator-factory.js';
import { createContentSectionHTML, createContentBlockHTML } from '$lib/blocks/htmlTemplates.js';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { marked } from 'marked';

// Remove test function now that we've confirmed markdown works
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
    htmlRenderer: (props, childrenHtml, attributes) => {
      const { headline } = props;
      
      return createContentSectionHTML(
        headline,
        childrenHtml.content_blocks || '',
        attributes
      );
    }
  }),
  
  // For content_block, we'll need custom implementation to handle markdown conversion
  web_content_block: {
    html: function(block: Blockly.Block): string {
      const markdownContent = block.getFieldValue('CONTENT');
      
      // Replace literal '\n' with actual newlines
      const processedMarkdown = markdownContent.replace(/\\n/g, '\n');
      
      // Convert markdown to HTML properly
      const htmlContent = marked.parse(processedMarkdown, { async: false }) as string;
      
      // Get parent block's column setting
      let columns = 1; // Default to 1 column
      const parent = block.getSurroundParent();
      if (parent && parent.type === 'web_content_section') {
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
      
      return createContentBlockHTML(htmlContent, columns, attributes);
    },
    
    highLevel: function(block: Blockly.Block): any {
      return {
        type: "contentBlock",
        properties: {
          content: block.getFieldValue('CONTENT'),
          id: block.getFieldValue('ID'),
          className: block.getFieldValue('CLASS')
        }
      };
    }
  }
}; 
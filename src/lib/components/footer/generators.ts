import { createGenerator } from '$lib/utils/generator-factory.js';
import { createFooterHTML, createFooterLinkHTML } from '$lib/blocks/htmlTemplates.js';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

// Create generators for footer components
export const footerGenerators = {
  web_footer: createGenerator({
    propertyMappings: [
      { componentProp: 'copyright' }
    ],
    childInputs: [
      { inputName: 'LINKS' }
    ],
    
    // Custom HTML renderer that uses the existing template
    htmlRenderer: (props, childrenHtml) => {
      const { copyright } = props;
      
      return createFooterHTML(
        copyright,
        childrenHtml.links || ''
      );
    }
  }),
  
  web_footer_link: createGenerator({
    propertyMappings: [
      { componentProp: 'text' },
      { componentProp: 'url' }
    ],
    
    // Custom HTML renderer that uses the existing template
    htmlRenderer: (props, childrenHtml) => {
      const { text, url } = props;
      
      return createFooterLinkHTML(text, url);
    }
  })
}; 
import { createGenerator } from '$lib/utils/generator-factory.js';
import { createFooterHTML, createFooterLinkHTML } from '$lib/blocks/htmlTemplates.js';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

// Create generators for footer components
export const footerGenerators = {
  web_footer: createGenerator({
    propertyMappings: [
      { componentProp: 'id',  },
      { componentProp: 'class', },
      { componentProp: 'copyright' }
    ],
    childInputs: [
      { inputName: 'LINKS' }
    ],
    
    // Custom HTML renderer that uses the existing template
    htmlRenderer: (props, children, attributes) => {
      const { copyright } = props;
      
      return createFooterHTML(
        copyright,
        children.links || '',
        attributes
      );
    }
  }),
  
  web_footer_link: createGenerator({
    propertyMappings: [
      { componentProp: 'text' },
      { componentProp: 'url' }
    ],
    
    // Custom HTML renderer that uses the existing template
    htmlRenderer: (props) => {
      const { text, url } = props;
      
      return createFooterLinkHTML(text, url);
    }
  })
}; 
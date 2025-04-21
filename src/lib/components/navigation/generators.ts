import { createGenerator } from '$lib/utils/generator-factory.js';
import * as HTML from '$lib/blocks/htmlTemplates.js';

// Create navigation generators using the factory
export const navigationGenerators = {
  // Header generator
  web_header: createGenerator({
    propertyMappings: [
      { componentProp: 'logoText', blockField: 'LOGO_TEXT' },
      { componentProp: 'includeSignup', blockField: 'INCLUDE_SIGNUP', transform: val => val === 'TRUE' }
    ],
    childInputs: [
      { inputName: 'LINKS' }
    ],
    htmlRenderer: (props, children) => 
      HTML.createHeaderHTML(props.logoText, props.includeSignup, children.links) + '\n'
  }),
  
  // Navigation item generator
  web_nav_item: createGenerator({
    propertyMappings: [
      { componentProp: 'text', blockField: 'TEXT' },
      { componentProp: 'url', blockField: 'URL' }
    ],
    htmlRenderer: (props, children) => 
      HTML.createNavItemHTML(props.text, props.url)
  })
}; 
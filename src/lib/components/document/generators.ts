import { createGenerator } from '$lib/utils/generator-factory.js';
import * as HTML from '$lib/blocks/htmlTemplates.js';

// Create document generator using the factory
export const documentGenerators = {
  web_document: createGenerator({
    propertyMappings: [
      { componentProp: 'title' },
      { componentProp: 'theme' }
    ],
    childInputs: [
      { inputName: 'CONTENT' }
    ],
    htmlRenderer: (props, children) => 
      HTML.createDocumentHTML(props.title, props.theme, children.content) + '\n'
  })
}; 
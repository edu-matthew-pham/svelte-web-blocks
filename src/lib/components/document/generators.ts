import { createGenerator } from '$lib/utils/generator-factory.js';
import * as BootstrapHTML from '$lib/blocks/htmlTemplates.js';
import * as RawHTML from '$lib/blocks/rawHtmlTemplates.js';
import { documentContext } from '$lib/utils/document-context.js';

// Create document generator using the factory
export const documentGenerators = {
  web_document: createGenerator({
    propertyMappings: [
      { componentProp: 'title' },
      { componentProp: 'theme' },
      { componentProp: 'useBootstrap', blockField: 'USE_BOOTSTRAP' }
    ],
    childInputs: [
      { inputName: 'CONTENT' }
    ],
    scriptInputs: [
      { inputName: 'SCRIPTS' }
    ],
    styleInputs: [
      { inputName: 'STYLES' }
    ],
    onloadInput: "ONLOAD",
    htmlRenderer: (props, children, attributes) => {
      // Choose the appropriate HTML template based on the useBootstrap setting
      const useBootstrap = documentContext.isBootstrapEnabled();
      const HTML = useBootstrap ? BootstrapHTML : RawHTML;
      
      return HTML.createDocumentHTML(
        props.title, 
        props.theme, 
        children.content, 
        children.scripts, 
        children.styles, 
        children.onloadScripts, 
        attributes
      );
    }
  })
}; 
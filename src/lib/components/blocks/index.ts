import type { WebBlockDefinitions, WebBlockGeneratorFunctions } from '$lib/types.js';

// More generic module type
type ComponentModule = {
  [key: string]: any;
};

// Component registry
const componentModules = [
  import('../document/index.js'),
  import('../navigation/index.js'),
  import('../hero/index.js'),
  import('../content/index.js'),
  import('../features/index.js'),
  import('../footer/index.js'),
  import('../forms/index.js'),
  import('../dynamic/index.js'),
  import('../style/index.js'),

  import('$lib/components/js/create/index.js'),
  import('$lib/components/js/dom/index.js'),
  import('$lib/components/js/variables/index.js'),
  import('$lib/components/js/logic/index.js'),
  import('$lib/components/js/math/index.js'),
  import('../custom/index.js'),
  import('$lib/components/js/default/index.js'),
  
  
  //import('$lib/components/js/operations/index.js'),
  // Add new components here
];

// Return type
interface BlocksBundle {
  definitions: WebBlockDefinitions;
  generators: WebBlockGeneratorFunctions;
  parsers: Record<string, any>;
  toolboxXml: string;
}

export async function initializeBlocks(): Promise<BlocksBundle> {
  const modules = await Promise.all(componentModules) as ComponentModule[];
  
  // Initialize containers
  const definitions: WebBlockDefinitions = {};
  const generators: WebBlockGeneratorFunctions = {};
  const parsers: Record<string, any> = {};
  const htmlToolboxCategories: string[] = [];
  const jsToolboxCategories: string[] = [];
  
  // Combine all exports generically
  modules.forEach((module, index) => {
    // Look for definitions
    Object.keys(module).forEach(key => {
      if (key.endsWith('Definitions')) {
        Object.assign(definitions, module[key]);
      } else if (key.endsWith('Generators')) {
        Object.assign(generators, module[key]);
      } else if (key.includes('Parser')) { // Handles both 'Parser' and 'Parsers'
        Object.assign(parsers, module[key]);
      } else if (key.endsWith('Toolbox')) {
        // Separate HTML and JS toolbox categories
        // The first 8 imports are HTML-related components
        if (index < 9) {
          htmlToolboxCategories.push(module[key]);
        } else {
          jsToolboxCategories.push(module[key]);
        }
      }
    });
  });
  
  // Combine toolbox categories with a separator
  const toolboxXml = `
<xml id="toolbox" style="display: none">
  <category name="HTML Components" expanded="true" colour="#5b80a5">
    ${htmlToolboxCategories.join('\n')}
  </category>
  
  <sep></sep>
  
  <category name="JavaScript" expanded="true" colour="#9fa55b">
    ${jsToolboxCategories.join('\n')}
  </category>
</xml>
  `;
  
  return { definitions, generators, parsers, toolboxXml };
} 
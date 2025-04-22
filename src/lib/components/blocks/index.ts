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
  import('$lib/components/js/dom/index.js'),
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
  const toolboxCategories: string[] = [];
  
  // More detailed debug logging
  console.log("Loaded modules details:");
  modules.forEach((module, i) => {
    console.log(`Module ${i}:`, {
      keys: Object.keys(module),
      hasDocumentParser: !!module.documentParser,
      parserType: module.documentParsers ? typeof module.documentParsers : 'undefined',
      parserKeys: module.documentParsers ? Object.keys(module.documentParsers) : []
    });
  });
  
  // Combine all exports generically
  modules.forEach(module => {
    // Look for definitions
    Object.keys(module).forEach(key => {
      if (key.endsWith('Definitions')) {
        Object.assign(definitions, module[key]);
      } else if (key.endsWith('Generators')) {
        Object.assign(generators, module[key]);
      } else if (key.includes('Parser')) { // Handles both 'Parser' and 'Parsers'
        Object.assign(parsers, module[key]);
      } else if (key.endsWith('Toolbox')) {
        toolboxCategories.push(module[key]);
      }
    });
  });
  
  console.log("Available parsers:", Object.keys(parsers));
  
  const toolboxXml = `
<xml id="toolbox" style="display: none">
  ${toolboxCategories.join('\n')}
</xml>
  `;
  
  return { definitions, generators, parsers, toolboxXml };
} 
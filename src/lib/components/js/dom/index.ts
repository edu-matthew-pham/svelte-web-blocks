import { jsDomDefinitions } from './definitions.js';
import { jsDomGenerators } from './generators.js';
import toolbox from './toolbox.xml?raw';

// Export everything according to the expected naming pattern
export { 
  jsDomDefinitions,
  jsDomGenerators,
  toolbox as jsDomToolbox
};

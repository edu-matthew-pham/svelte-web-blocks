// Reexport your entry components here

// Export utility modules for customization
export { webBlocks } from './blocks/definitions.js';
export { webGenerators } from './blocks/generators.js';
export { defaultToolbox } from './toolbox/default-toolbox.js';
export { createBlocksFromJson } from './blocks/parser.js';
export { convertHTMLToPug } from './blocks/pugTemplates.js';

// Export new refactored modules
export { createGenerator } from './utils/generator-factory.js';
export { createBlockDefinitions } from './utils/block-factory.js';
export { initializeBlocks } from './components/blocks/index.js';

// Export component modules
export * from './components/document/index.js';
export * from './components/navigation/index.js';
export * from './components/content/index.js';
export * from './components/features/index.js';
export * from './components/forms/index.js';
export * from './components/dynamic/index.js';
export * from './blocks/js/dom/index.js';

import BlocklyWorkspace from './BlocklyWorkspace.svelte';
import BlocklyWorkspaceWithPreview from './BlocklyWorkspaceWithPreview.svelte';
import BlocklyEditor from '$lib/components/workspace/BlocklyEditor.svelte';

export {
    BlocklyWorkspace,
    BlocklyWorkspaceWithPreview,
    BlocklyEditor
};
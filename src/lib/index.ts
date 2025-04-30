// Reexport your entry components here

// Export utility modules for customization
export { webBlocks } from './blocks/definitions.js';
export { webGenerators } from './blocks/generators.js';
export { defaultToolbox } from './toolbox/default-toolbox.js';
export { createBlocksFromJson } from './blocks/parser.js';
export { convertHTMLToPug } from './blocks/pugTemplates.js';

// Export core functionality
export { initializeBlocks } from './components/blocks/index.js';
export { createGenerator } from './utils/generator-factory.js';
export { createBlockDefinitions } from './utils/block-factory.js';
export  { initializeVisibilityExtensions } from './utils/blockly-extensions.js';
export { initializeBlocklyOverrides } from './utils/blockly-overrides.js';

// Export main components
export { default as BlocklyWorkspace } from './BlocklyWorkspace.svelte';
export { default as BlocklyWorkspaceWithPreview } from './BlocklyWorkspaceWithPreview.svelte';
export { default as BlocklyEditor } from './components/workspace/BlocklyEditor.svelte';

// Export examples
export { default as BasicBlockly } from './examples/BasicBlockly.svelte';
export { default as BlocklyToJson } from './examples/BlocklyToJson.svelte';
export { default as JsonToBlocks } from './examples/JsonToBlocks.svelte';
export { default as HtmlToPug } from './examples/HtmlToPug.svelte';

// Export component modules (these are used by initializeBlocks)
export * from './components/document/index.js';
export * from './components/navigation/index.js';
export * from './components/hero/index.js';
export * from './components/content/index.js';
export * from './components/features/index.js';
export * from './components/footer/index.js';
export * from './components/forms/index.js';
export * from './components/dynamic/index.js';
export * from './components/style/index.js';
export * from './components/custom/index.js';

// JS component exports
export * from './components/js/create/index.js';
export * from './components/js/dom/index.js';
export * from './components/js/variables/index.js';
export * from './components/js/default/index.js';
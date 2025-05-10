<script lang="ts">
    import { onMount, createEventDispatcher, afterUpdate } from 'svelte';
    import * as Blockly from 'blockly';
    import { javascriptGenerator } from 'blockly/javascript';
    import { initializeBlocks } from '../blocks/index.js';
    import { createBlocksFromJson } from '$lib/blocks/parser.js';
    import { initializeBlocklyOverrides } from '$lib/utils/blockly-overrides.js';
    // Replace CodeMirror imports with svelte-codemirror-editor
    import CodeMirror from 'svelte-codemirror-editor';
    import { javascript } from '@codemirror/lang-javascript';
    import { json } from '@codemirror/lang-json';
    import { html } from '@codemirror/lang-html';
    import { EditorState } from '@codemirror/state';
    import { createPreviewSafety } from '$lib/utils/preview-safety.js';
    import type { ConsoleMessage } from '$lib/utils/preview-safety.js';
    import { basicSetup } from '@codemirror/basic-setup';
    import { drawSelection, EditorView } from '@codemirror/view';

    // Props with defaults
    export let initialXml = '';
    export let readOnly = false;
    export let workspaceOptions = {}; 
    export let showCodeView = true;
    export let showJsonView = true;
    export let initialTab: 'blocks'|'json'|'code'|'preview'|'dom' = 'blocks'; // 'blocks', 'json', or 'code' or 'preview' or 'dom'
  
    // Fix for window declaration
   

    // Internal state
    let blocklyDiv: HTMLElement | undefined;
    let workspace: Blockly.WorkspaceSvg | undefined;
    const dispatch = createEventDispatcher();
    
    let jsonCode = '';
    let generatedCode = '';
    let activeTab: 'blocks'|'json'|'code'|'preview'|'dom' = initialTab;
    let componentsLoaded = false;
    let modifiedDomString = '';
    
    // Initialize editor instances with undefined
    let jsonEditor: EditorView | undefined;
    let htmlEditor: EditorView | undefined;
    let domEditor: EditorView | undefined;
  
    // Initialize container refs with undefined
    let jsonContainer: HTMLElement | undefined;
    let htmlContainer: HTMLElement | undefined;
    let domContainer: HTMLElement | undefined;
  
    // Add a type for the component
    type Component = {
      type: string;
      [key: string]: any;  // Allow any other properties
    };
  
    // Then add the implementation for blockToHighLevel
    javascriptGenerator.blockToHighLevel = function(block: Blockly.Block) {
      const func = this.forBlock[block.type]?.highLevel;
      return func ? func(block) : null;
    };
  
    // Add state for preview safety
    let previewSafety = createPreviewSafety({
      showErrorOverlay: true  // Enable the visual error overlay
    });

    // Function to generate JSON representation of the workspace
    function generateJsonCode(workspace: Blockly.WorkspaceSvg | undefined): string {
      if (!workspace) return '// No workspace available';
      try {
        const topBlocks = workspace.getTopBlocks(true);
        const components = topBlocks
          .map(block => {
            const highLevelFn = javascriptGenerator.forBlock[block.type]?.highLevel;
            if (highLevelFn) {
              return highLevelFn(block);
            }
            return {
              type: block.type,
              id: block.id
            };
          })
          .filter(component => component !== null);
        
        return JSON.stringify(components, null, 2);
      } catch (error) {
        console.error('Error generating JSON code:', error);
        return '// Error generating JSON';
      }
    }

    // Add initialization logic with onMount
    onMount(() => {
      if (!blocklyDiv) return;
  
      // Use an immediately invoked async function for initialization
      (async () => {
        // Load components using the new structure
        const { definitions, generators, parsers, toolboxXml } = await initializeBlocks();
        
        // Store parsers for later use
        window.__blocklyParsers = parsers;
        
        // Register custom blocks
        Object.entries(definitions).forEach(([type, blockDef]) => {
          Blockly.Blocks[type] = blockDef;
        });
        
        // Initialize visibility extensions after blocks are registered
        import('$lib/utils/blockly-extensions.js').then(({ initializeVisibilityExtensions }) => {
          initializeVisibilityExtensions();
        });
  
        // Register custom generators
        Object.entries(generators).forEach(([name, generator]) => {
          javascriptGenerator.forBlock[name] = generator.html;
          
          // Store highLevel function for JSON generation if available
          if (generator.highLevel) {
            javascriptGenerator.forBlock[name].highLevel = generator.highLevel;
          }
        });
  
        // Initialize the Blockly workspace with merged options
        const defaultOptions = {
          toolbox: toolboxXml,
          readOnly,
          trashcan: true,
          zoom: {
            controls: true,
            wheel: false,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2
          }
        };
        
        const mergedOptions = { ...defaultOptions, ...workspaceOptions };
        workspace = Blockly.inject(blocklyDiv, mergedOptions);
        
        // Add early return if workspace wasn't created properly
        if (!workspace) {
          console.error('Failed to initialize Blockly workspace');
          return;
        }
  
        // Load initial XML if provided
        if (initialXml) {
          try {
            const xml = Blockly.utils.xml.textToDom(initialXml);
            Blockly.Xml.domToWorkspace(xml, workspace);
          } catch (e) {
            console.error('Error loading initial XML', e);
          }
        }
  
        // Set up change listener
        workspace.addChangeListener((event) => {
          if (event.type === Blockly.Events.FINISHED_LOADING) return;
          
          // Get the current code and XML
          generatedCode = javascriptGenerator.workspaceToCode(workspace);
          jsonCode = generateJsonCode(workspace);
          const xml = Blockly.Xml.workspaceToDom(workspace!);
          const xmlText = Blockly.Xml.domToText(xml);
          
          dispatch('change', { code: generatedCode, json: jsonCode, xml: xmlText, event });
        });
  
        // Handle resize
        const resizeObserver = new ResizeObserver(() => {
          Blockly.svgResize(workspace!);
        });
        resizeObserver.observe(blocklyDiv);
        
        componentsLoaded = true;
      })();

      initializeBlocklyOverrides(workspace!);
      
      // Set up preview safety event listeners
      previewSafety.addEventListeners((event) => {
        if ('type' in event && (event.type === 'error' || event.type === 'timeout' || event.type === 'infiniteLoop')) {
          console.error('Preview error:', event.message);
        } else {
          const consoleEvent = event as ConsoleMessage;
          console.log(`Preview console [${consoleEvent.type}]:`, consoleEvent.message);
        }
      });
      
      // Return the cleanup function
      return () => {
        if (workspace) {
          workspace.dispose();
        }
        if (blocklyDiv) {
          const resizeObserver = new ResizeObserver(() => {});
          resizeObserver.disconnect();
        }
        previewSafety.cleanup();
        cleanupEditors();
      };
    });
    
    // Function to clean up editor instances
    function cleanupEditors() {
      if (jsonEditor) jsonEditor.destroy();
      if (htmlEditor) htmlEditor.destroy();
      if (domEditor) domEditor.destroy();
    }
    
    // Function to resize the Blockly workspace
    function resize(): void {
      if (workspace) Blockly.svgResize(workspace);
    }

    // Function to set active tab
    function setActiveTab(tab: 'blocks'|'json'|'code'|'preview'|'dom'): void {
      activeTab = tab;
      
      if (tab === 'blocks' && workspace) {
        resize();
      }
      
      // We'll add more tab-specific logic later
    }
</script>

<div class="blockly-container">
  {#if showCodeView || showJsonView}
    <!-- Tab navigation -->
    <div class="blockly-tabs">
      <button 
        class="tab-button {activeTab === 'blocks' ? 'active' : ''}" 
        on:click={() => setActiveTab('blocks')}>
        Blocks
      </button>
      
      {#if showJsonView}
        <button 
          class="tab-button {activeTab === 'json' ? 'active' : ''}" 
          on:click={() => setActiveTab('json')}>
          JSON
        </button>
      {/if}
      
      {#if showCodeView}
        <button 
          class="tab-button {activeTab === 'code' ? 'active' : ''}" 
          on:click={() => setActiveTab('code')}>
          HTML
        </button>
      {/if}

      <!-- Preview tab -->
      <button 
        class="tab-button {activeTab === 'preview' ? 'active' : ''}" 
        on:click={() => setActiveTab('preview')}>
        Preview
      </button>

      <!-- DOM tab -->
      <button 
        class="tab-button {activeTab === 'dom' ? 'active' : ''}" 
        on:click={() => setActiveTab('dom')}> 
        Live HTML
      </button>
    </div>
  {/if}

  <!-- Content area -->
  <div class="blockly-content">
    <!-- Loading indicator -->
    {#if !componentsLoaded}
      <div class="loading-container">
        <p>Loading components...</p>
      </div>
    {/if}
    
    <!-- Blocks view -->
    <div class="blockly-editor" 
         bind:this={blocklyDiv} 
         style="display: {activeTab === 'blocks' ? 'block' : 'none'}">
    </div>
  </div>
</div>

<style>
  .blockly-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .blockly-tabs {
    display: flex;
    border-bottom: 1px solid #ddd;
    margin-bottom: 0;
    position: relative;
    z-index: 10;
  }
  
  .tab-button {
    padding: 8px 16px;
    border: none;
    background: #f5f5f5;
    cursor: pointer;
    margin-right: 2px;
    border-radius: 3px 3px 0 0;
    border: 1px solid #ddd;
    border-bottom: none;
  }
  
  .tab-button.active {
    background: white;
    border-bottom: 2px solid white;
    margin-bottom: -1px;
    font-weight: bold;
  }
  
  .blockly-content {
    flex: 1;
    position: relative;
    min-height: 300px;
  }
  
  .blockly-editor {
    width: 100%;
    height: 100%;
    min-height: 300px;
    position: absolute;
    top: 0;
    left: 0;
  }
  
  .code-container {
    width: 100%;
    height: 100%;
    min-height: 300px;
    overflow: auto;
    border: 1px solid #ddd;
    padding: 10px;
    box-sizing: border-box;
  }
  
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    position: absolute;
    background: rgba(255,255,255,0.7);
    z-index: 10;
  }

  /* Preview styles */
  .preview-container {
    width: 100%;
    height: 100%;
    border: 1px solid #ddd;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
  .preview-iframe {
    width: 100%;
    flex: 1;
    border: none;
  }
  .preview-controls {
    padding: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f5f5f5;
    border-bottom: 1px solid #ddd;
  }
  .refresh-button {
    padding: 6px 12px;
    background: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
  }
  .refresh-button:hover {
    background: #e0e0e0;
  }
  .preview-error-indicator {
    color: #d32f2f;
    font-size: 14px;
    margin-left: 10px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .action-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    position: relative;
    z-index: 10;
  }
  
  .action-buttons button {
    padding: 6px 12px;
    background: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .action-buttons button:hover {
    background: #e0e0e0;
  }

  .editor-wrapper {
    width: 100%;
    height: calc(100% - 40px); /* Account for action buttons */
    overflow: hidden;
    background-color: white;
    border: 1px solid #ddd;
  }

  /* Target the code container that doesn't have buttons */
  .code-container:has(.editor-wrapper:only-child) .editor-wrapper {
    height: 100%;
  }

  /* CodeMirror comment styling */
  :global(.ͼm[data-comment-type="style"]) {
    color: #9c27b0; /* Purple */
    background-color: rgba(237, 231, 246, 0.8);
    border: 1px solid #9c27b0;
  }
  
  :global(.ͼm[data-comment-type="content"]) {
    color: #2e7d32; /* Green */
    background-color: rgba(232, 245, 233, 0.8);
    border: 1px solid #2e7d32;
  }
  
  :global(.ͼm[data-comment-type="script"]) {
    color: #0277bd; /* Blue */
    background-color: rgba(227, 242, 253, 0.8);
    border: 1px solid #0277bd;
  }
  
  :global(.ͼm[data-comment-type="onload"]) {
    color: #ef6c00; /* Orange */
    background-color: rgba(255, 243, 224, 0.8);
    border: 1px solid #ef6c00;
  }
</style>

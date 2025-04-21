<script lang="ts">
    import { onMount, createEventDispatcher, afterUpdate } from 'svelte';
    import * as Blockly from 'blockly';
    import { javascriptGenerator } from 'blockly/javascript';
    import { webBlocks } from '$lib/blocks/definitions.js';
    import { webGenerators } from '$lib/blocks/generators.js';
    import { defaultToolbox } from '$lib/toolbox/default-toolbox.js';
  
    // Props with defaults
    export let initialXml = '';
    export let readOnly = false;
    export let toolbox = defaultToolbox;
    export let workspaceOptions = {}; // Additional options to pass to Blockly.inject
    export let showCodeView = true;
    export let showJsonView = true;
    export let initialTab = 'blocks'; // 'blocks', 'json', or 'code'
  
    // Internal state
    let blocklyDiv: HTMLElement;
    let workspace: Blockly.WorkspaceSvg;
    const dispatch = createEventDispatcher();
    
    let generatedCode = '';
    let jsonCode = '';
    let activeTab = initialTab;
  
    onMount(() => {
      if (!blocklyDiv) return;
  
      // Register custom blocks
      Object.entries(webBlocks).forEach(([type, blockDef]) => {
        Blockly.Blocks[type] = blockDef;
      });
  
      // Register custom generators
      Object.entries(webGenerators).forEach(([name, generator]) => {
        javascriptGenerator.forBlock[name] = generator.html;
        
        // Store highLevel function for JSON generation if available
        if (generator.highLevel) {
          javascriptGenerator.forBlock[name].highLevel = generator.highLevel;
        }
      });
  
      // Initialize the Blockly workspace with merged options
      const defaultOptions = {
        toolbox,
        readOnly,
        trashcan: true,
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        }
      };
      
      const mergedOptions = { ...defaultOptions, ...workspaceOptions };
      workspace = Blockly.inject(blocklyDiv, mergedOptions);
  
      // Register the reactive value blocks callback
      workspace.registerToolboxCategoryCallback(
        'REACTIVE_VALUE_BLOCKS',
        function(workspace) {
          // Return flyout item definitions instead of blocks
          return [
            {
              kind: 'block',
              type: 'reactive_get_new_value'
            },
            {
              kind: 'block',
              type: 'reactive_get_old_value'
            }
          ];
        }
      );
  
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
        const xml = Blockly.Xml.workspaceToDom(workspace);
        const xmlText = Blockly.Xml.domToText(xml);
        
        dispatch('change', { code: generatedCode, json: jsonCode, xml: xmlText, event });
      });
  
      // Handle resize
      const resizeObserver = new ResizeObserver(() => {
        Blockly.svgResize(workspace);
      });
      resizeObserver.observe(blocklyDiv);
  
      return () => {
        workspace.dispose();
        resizeObserver.disconnect();
      };
    });
  
    // Function to generate JSON representation of the workspace
    function generateJsonCode(workspace: Blockly.WorkspaceSvg) {
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
  
    // Public methods
    export function getCode() {
      if (!workspace) return '';
      return javascriptGenerator.workspaceToCode(workspace);
    }
  
    export function getJson() {
      if (!workspace) return '';
      return generateJsonCode(workspace);
    }
  
    export function getXml() {
      if (!workspace) return '';
      const xml = Blockly.Xml.workspaceToDom(workspace);
      return Blockly.Xml.domToText(xml);
    }
  
    export function setXml(xmlText: string) {
      if (!workspace) return;
      try {
        workspace.clear();
        const xml = Blockly.utils.xml.textToDom(xmlText);
        Blockly.Xml.domToWorkspace(xml, workspace);
      } catch (e) {
        console.error('Error setting XML', e);
      }
    }
  
    export function clearWorkspace() {
      if (workspace) workspace.clear();
    }
  
    export function resize() {
      if (workspace) Blockly.svgResize(workspace);
    }
  </script>
  
  <div class="blockly-container">
    {#if showCodeView || showJsonView}
      <!-- Tab navigation -->
      <div class="blockly-tabs">
        <button 
          class="tab-button {activeTab === 'blocks' ? 'active' : ''}" 
          on:click={() => { activeTab = 'blocks'; resize(); }}>
          Blocks
        </button>
        
        {#if showJsonView}
          <button 
            class="tab-button {activeTab === 'json' ? 'active' : ''}" 
            on:click={() => activeTab = 'json'}>
            JSON
          </button>
        {/if}
        
        {#if showCodeView}
          <button 
            class="tab-button {activeTab === 'code' ? 'active' : ''}" 
            on:click={() => activeTab = 'code'}>
            HTML
          </button>
        {/if}
      </div>
    {/if}
  
    <!-- Content area -->
    <div class="blockly-content">
      <!-- Blocks view -->
      <div class="blockly-editor" 
           bind:this={blocklyDiv} 
           style="display: {activeTab === 'blocks' ? 'block' : 'none'}">
      </div>
      
      <!-- JSON view -->
      {#if showJsonView && activeTab === 'json'}
        <div class="code-container">
          <pre class="code-display"><code class="language-json">{jsonCode}</code></pre>
        </div>
      {/if}
      
      <!-- HTML view -->
      {#if showCodeView && activeTab === 'code'}
        <div class="code-container">
          <pre class="code-display"><code class="language-html">{generatedCode}</code></pre>
        </div>
      {/if}
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
    
    .code-display {
      margin: 0;
      white-space: pre-wrap;
      font-family: monospace;
      font-size: 14px;
    }
  </style>
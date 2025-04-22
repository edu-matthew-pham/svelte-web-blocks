<script lang="ts">
  import { onMount, createEventDispatcher, afterUpdate } from 'svelte';
  import * as Blockly from 'blockly';
  import { webBlocks } from '$lib/blocks/definitions.js';
  import { webGenerators } from '$lib/blocks/generators.js';
  import { defaultToolbox } from '$lib/toolbox/default-toolbox.js';
  import { WorkspaceSvg } from 'blockly';
  import { createBlocksFromJson } from '$lib/blocks/parser.js';
  import { javascriptGenerator } from 'blockly/javascript';

  // Props
  export let initialXml = '';
  export let readOnly = false;
  export let toolbox = defaultToolbox;
  export let customBlocks = '';

  // Internal state
  let blocklyDiv: HTMLElement;
  let workspace: WorkspaceSvg;
  const dispatch = createEventDispatcher();
  
  // Add state for code display
  let generatedCode = '';
  let jsonCode = '';
  let activeTab = 'blocks'; // 'blocks', 'json', or 'code'

  // Before the forEach loop, add this type definition
  type GeneratorFunction = Function & {
    highLevel?: (block: any) => any;
  };

  // Initialize Blockly when the component mounts
  onMount(() => {
    if (!blocklyDiv) return;

    // Register custom blocks
    Object.entries(webBlocks).forEach(([type, blockDef]) => {
      Blockly.Blocks[type] = blockDef;
    });

    // Safety check for javascriptGenerator
    console.log("javascriptGenerator available?", !!javascriptGenerator);
    
    // Ensure forBlock exists
    if (!javascriptGenerator.forBlock) {
      javascriptGenerator.forBlock = {};
    }

    // Register custom generators with proper safety checks
    Object.entries(webGenerators).forEach(([blockType, generatorObj]) => {
      if (typeof generatorObj === 'function') {
        // Register the generator function
        javascriptGenerator.forBlock[blockType] = generatorObj;
        
        // Use type assertion for highLevel property
        const typedFunc = generatorObj as GeneratorFunction;
        if (typedFunc.highLevel && typeof typedFunc.highLevel === 'function') {
          javascriptGenerator.forBlock[blockType].highLevel = typedFunc.highLevel as (block: any) => any;
        }
      } else if (generatorObj && typeof generatorObj === 'object' && generatorObj.html) {
        // Register using the html property
        javascriptGenerator.forBlock[blockType] = generatorObj.html;
        
        // Use type assertion for the object form
        const typedObj = generatorObj as { html: Function, highLevel?: (block: any) => any };
        if (typedObj.highLevel && typeof typedObj.highLevel === 'function') {
          javascriptGenerator.forBlock[blockType].highLevel = typedObj.highLevel;
        }
      }
    });

    // Create custom blocks from JSON if provided
    if (customBlocks && customBlocks.length > 0) {
      createBlocksFromJson(workspace, customBlocks);
    }

    // Initialize the Blockly workspace
    workspace = Blockly.inject(blocklyDiv, {
      toolbox: toolbox,
      readOnly: readOnly,
      trashcan: true,
      media: 'https://blockly-demo.appspot.com/static/media/',
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      },
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true
      }
    });

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
      generatedCode = Blockly.JavaScript.workspaceToCode(workspace);
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
      // Clean up on component unmount
      workspace.dispose();
      resizeObserver.disconnect();
    };
  });

  // Function to generate JSON representation of the workspace
  function generateJsonCode(workspace: WorkspaceSvg) {
    try {
      const topBlocks = workspace.getTopBlocks(true);
      const components = topBlocks
        .map(block => {
          // Check if there's a highLevel generator function
          const highLevelFn = Blockly.JavaScript.forBlock[block.type]?.highLevel;
          if (highLevelFn) {
            return highLevelFn(block);
          }
          // Fallback to a simple representation
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

  // Function to switch between tabs
  function setActiveTab(tab: string) {
    activeTab = tab;
    
    // When switching back to blocks tab, resize the workspace
    if (tab === 'blocks' && workspace) {
      setTimeout(() => Blockly.svgResize(workspace), 10);
    }
  }

  // Public methods (exposed via bind:this)
  export function getCode() {
    if (!workspace) return '';
    return Blockly.JavaScript.workspaceToCode(workspace);
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
    if (workspace) {
      workspace.clear();
    }
  }

  export function resize() {
    if (workspace) {
      Blockly.svgResize(workspace);
    }
  }
</script>

<div class="blockly-container">
  <!-- Tab navigation -->
  <div class="blockly-tabs">
    <button 
      class="tab-button {activeTab === 'blocks' ? 'active' : ''}" 
      on:click={() => setActiveTab('blocks')}>
      Blocks
    </button>
    <button 
      class="tab-button {activeTab === 'json' ? 'active' : ''}" 
      on:click={() => setActiveTab('json')}>
      JSON
    </button>
    <button 
      class="tab-button {activeTab === 'code' ? 'active' : ''}" 
      on:click={() => setActiveTab('code')}>
      HTML
    </button>
    <button 
      class="tab-button {activeTab === 'preview' ? 'active' : ''}" 
      on:click={() => setActiveTab('preview')}>
      Preview
    </button>
  </div>

  <!-- Content area -->
  <div class="blockly-content">
    <!-- Blocks view -->
    <div class="blockly-editor" 
         bind:this={blocklyDiv} 
         style="display: {activeTab === 'blocks' ? 'block' : 'none'}">
    </div>
    
    <!-- JSON view -->
    {#if activeTab === 'json'}
      <div class="code-container">
        <pre class="code-display"><code class="language-json">{jsonCode}</code></pre>
      </div>
    {/if}
    
    <!-- HTML view -->
    {#if activeTab === 'code'}
      <div class="code-container">
        <pre class="code-display"><code class="language-html">{generatedCode}</code></pre>
      </div>
    {/if}

    <!-- Preview view -->
    {#if activeTab === 'preview'}
      <div class="preview-container">
        <iframe
          class="preview-iframe"
          srcdoc={generatedCode}
          sandbox="allow-scripts"
        ></iframe>
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

  .preview-container {
    width: 100%;
    height: 100%;
    border: 1px solid #ddd;
    box-sizing: border-box;
  }
  .preview-iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
</style> 
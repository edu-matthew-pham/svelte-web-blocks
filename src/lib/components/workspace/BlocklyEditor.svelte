<script lang="ts">
     
    import { onMount, createEventDispatcher, afterUpdate } from 'svelte';
    import * as Blockly from 'blockly';
    import { javascriptGenerator } from 'blockly/javascript';
    import { initializeBlocks } from '../blocks/index.js';
    import { createBlocksFromJson } from '$lib/blocks/parser.js';
    import { initializeBlocklyOverrides } from '$lib/utils/blockly-overrides.js';
  
    // Props with defaults
    export let initialXml = '';
    export let readOnly = false;
    export let workspaceOptions = {}; 
    export let showCodeView = true;
    export let showJsonView = true;
    export let initialTab: 'blocks'|'json'|'code'|'preview'|'dom' = 'blocks'; // 'blocks', 'json', or 'code' or 'preview' or 'dom'
  
    // Internal state
    let blocklyDiv: HTMLElement;
    let workspace: Blockly.WorkspaceSvg;
    const dispatch = createEventDispatcher();
    
    let generatedCode = '';
    let jsonCode = '';
    let activeTab = initialTab;
    let componentsLoaded = false;
    let modifiedDomString = '';
  
    // Add a type for the component
    type Component = {
      type: string;
      [key: string]: any;  // Allow any other properties
    };
  
     
    // Then add the implementation (this can go right after the type declaration)
    javascriptGenerator.blockToHighLevel = function(block: Blockly.Block) {
      const func = this.forBlock[block.type]?.highLevel;
      return func ? func(block) : null;
    };
  
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
        
        componentsLoaded = true;
      })();

      initializeBlocklyOverrides(workspace);
      
      // Return the cleanup function directly (not in the Promise chain)
      return () => {
        if (workspace) {
          workspace.dispose();
        }
        if (blocklyDiv) {
          const resizeObserver = new ResizeObserver(() => {});
          resizeObserver.disconnect();
        }
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
    
    // New method to load JSON
    export function loadFromJson(jsonString: string) {
      if (!workspace) return;
      
      try {
        // Use the existing parser function that correctly handles children
        createBlocksFromJson(workspace, jsonString);
        
        // Trigger an update after loading
        generatedCode = javascriptGenerator.workspaceToCode(workspace);
        jsonCode = generateJsonCode(workspace);
        
        // Dispatch change event
        const xml = Blockly.Xml.workspaceToDom(workspace);
        const xmlText = Blockly.Xml.domToText(xml);
        dispatch('change', { code: generatedCode, json: jsonCode, xml: xmlText });
      } catch (e) {
        console.error('Error loading from JSON', e);
      }
    }
  
    export function clearWorkspace() {
      if (workspace) workspace.clear();
    }
  
    export function resize() {
      if (workspace) Blockly.svgResize(workspace);
    }

    // Add a function to get the current DOM from the iframe
    function captureModifiedDom() {
      try {
        const iframe = document.querySelector('.preview-iframe') as HTMLIFrameElement;
        if (iframe?.contentDocument) {
          modifiedDomString = iframe.contentDocument.documentElement.outerHTML;
        }
      } catch (e) {
        console.error('Error capturing DOM:', e);
        modifiedDomString = '<!-- Error capturing DOM -->';
      }
    }

    // Handle messages from iframe
    onMount(() => {
      window.addEventListener('message', (event) => {
        if (event.data?.source === 'preview-console') {
          const { type, message, timestamp } = event.data;
          console.log('Console captured:', type, message);
        }
      });
      
      return () => {
        window.removeEventListener('message', () => {});
      };
    });

    // Function to copy text to clipboard
    async function copyToClipboard(text: string) {
      try {
        await navigator.clipboard.writeText(text);
        alert('Copied to clipboard');
      } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy to clipboard');
      }
    }
    
    // Function to download text as a file
    function downloadFile(content: string, defaultFilename: string) {
      // Prompt user for filename
      const filename = prompt('Enter a filename:', defaultFilename) || defaultFilename;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // Function to handle importing JSON files
    function importJsonFile() {
      // Create a file input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.json,application/json';
      
      // Set up event handling for when a file is selected
      fileInput.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
          const contents = event.target?.result as string;
          if (contents) {
            loadFromJson(contents);
          }
        };
        reader.readAsText(file);
      };
      
      // Trigger file selection dialog
      fileInput.click();
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

        <!-- NEW: Preview tab -->
        <button 
          class="tab-button {activeTab === 'preview' ? 'active' : ''}" 
          on:click={() => activeTab = 'preview'}>
          Preview
        </button>

        <!-- NEW: DOM tab -->
        <button 
          class="tab-button {activeTab === 'dom' ? 'active' : ''}" 
          on:click={() => { activeTab = 'dom'; captureModifiedDom(); }}> 
          DOM
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
      
      <!-- JSON view -->
      <div class="code-container" style="display: {activeTab === 'json' ? 'block' : 'none'}">
        <div class="action-buttons">
          <button on:click={() => copyToClipboard(jsonCode)}>Copy JSON Code</button>
          <button on:click={() => downloadFile(jsonCode, 'component.json')}>Download JSON File</button>
          <button on:click={importJsonFile}>Import JSON File</button>
        </div>
        <pre class="code-display"><code class="language-json">{jsonCode}</code></pre>
      </div>
      
      <!-- HTML view -->
      <div class="code-container" style="display: {activeTab === 'code' ? 'block' : 'none'}">
        <div class="action-buttons">
          <button on:click={() => copyToClipboard(generatedCode)}>Copy HTML Code</button>
          <button on:click={() => downloadFile(generatedCode, 'component.html')}>Download HTML File</button>
        </div>
        <pre class="code-display"><code class="language-html">{generatedCode}</code></pre>
      </div>

      <!-- Preview view - always present but hidden when not active -->
      <div class="preview-container" style="display: {activeTab === 'preview' ? 'block' : 'none'}">
        <iframe
          class="preview-iframe"
          srcdoc={generatedCode}
          sandbox="allow-scripts allow-same-origin"
          title="Component Preview"
        ></iframe>
      </div>

      <!-- DOM view without refresh button -->
      <div class="code-container" style="display: {activeTab === 'dom' ? 'block' : 'none'}">
        <pre class="code-display"><code class="language-html">{modifiedDomString}</code></pre>
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
    }
    .preview-iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    .action-buttons {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
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

  </style> 
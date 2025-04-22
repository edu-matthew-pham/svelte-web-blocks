<script lang="ts">
     
    import { onMount, createEventDispatcher, afterUpdate } from 'svelte';
    import * as Blockly from 'blockly';
    import { javascriptGenerator } from 'blockly/javascript';
    import { initializeBlocks } from '../blocks/index.js';
    import { createBlocksFromJson } from '$lib/blocks/parser.js';
  
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

    /** helper to switch tabs (and auto-resize when going back to blocks) */
    function setActiveTab(tab: typeof activeTab) {
      activeTab = tab;
      if (tab === 'blocks') {
        // give the DOM a moment, then resize
        setTimeout(() => workspace && Blockly.svgResize(workspace), 0);
      } else if (tab === 'preview') {
        setTimeout(injectConsoleCapture, 100); // Inject after preview loads
      } 
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

    // Add this function to manually inject console capture
    function injectConsoleCapture() {
      try {
        const iframe = document.querySelector('.preview-iframe') as HTMLIFrameElement;
        if (!iframe?.contentWindow) return;
        
        // Create a script to override console methods
        const script = iframe.contentDocument?.createElement('script');
        if (!script) return;
        
        script.textContent = `
          (function() {
            const originalConsole = {
              log: console.log,
              error: console.error,
              warn: console.warn,
              info: console.info
            };
            
            function captureConsole(type, args) {
              // Convert args to string
              const message = Array.from(args).map(arg => {
                try {
                  return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
                } catch (e) {
                  return String(arg);
                }
              }).join(' ');
              
              // Send to parent
              window.parent.postMessage({
                source: 'preview-console',
                type: type,
                message: message,
                timestamp: Date.now()
              }, '*');
              
              // Call original
              return originalConsole[type].apply(console, args);
            }
            
            // Override console methods
            console.log = function() { return captureConsole('log', arguments); };
            console.error = function() { return captureConsole('error', arguments); };
            console.warn = function() { return captureConsole('warn', arguments); };
            console.info = function() { return captureConsole('info', arguments); };
          })();
        `;
        
        iframe.contentDocument?.head.appendChild(script);
      } catch (e) {
        console.error('Error injecting console capture:', e);
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
        <pre class="code-display"><code class="language-json">{jsonCode}</code></pre>
      </div>
      
      <!-- HTML view -->
      <div class="code-container" style="display: {activeTab === 'code' ? 'block' : 'none'}">
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

    /* Add to your style section */
    .dom-controls {
      padding: 5px;
      margin-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    /* Console styles */
    .console-container {
      padding: 10px;
      border: 1px solid #ddd;
      border-top: none;
    }
    .console-logs {
      max-height: 300px;
      overflow-y: auto;
    }
    .console-log {
      margin-bottom: 5px;
    }
  </style> 
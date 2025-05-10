<script lang="ts">
     
    import { onMount, createEventDispatcher, afterUpdate } from 'svelte';
    import * as Blockly from 'blockly';
    import { javascriptGenerator } from 'blockly/javascript';
    import { initializeBlocks } from '../blocks/index.js';
    import { createBlocksFromJson } from '$lib/blocks/parser.js';
    import { initializeBlocklyOverrides } from '$lib/utils/blockly-overrides.js';
    // Import Prism and language support
    import Prism from 'prismjs';
    import 'prismjs/components/prism-json';
    import 'prismjs/components/prism-markup';  // For HTML
    import 'prismjs/components/prism-javascript';  // For JavaScript
    import 'prismjs/components/prism-css';  // For CSS in style tags
    // Enable language embedding in markup
    import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace';
    // Import Prism CSS themes
    import 'prismjs/themes/prism.css';
    import { createPreviewSafety } from '$lib/utils/preview-safety.js';
    import type { ConsoleMessage } from '$lib/utils/preview-safety.js';
  
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
    let activeTab: 'blocks'|'json'|'code'|'preview'|'dom' = initialTab;
    let componentsLoaded = false;
    let modifiedDomString = '';
    
    // Refs for code containers
    let jsonContainer: HTMLElement;
    let htmlContainer: HTMLElement;
    let domContainer: HTMLElement;
  
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
  
    // Add state for preview safety
    let previewSafety = createPreviewSafety({
      showErrorOverlay: true  // Enable the visual error overlay
    });
  
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
      
      // Set up preview safety event listeners
      previewSafety.addEventListeners((event) => {
        if ('type' in event && (event.type === 'error' || event.type === 'timeout' || event.type === 'infiniteLoop')) {
          console.error('Preview error:', event.message);
        } else {
          const consoleEvent = event as ConsoleMessage;
          console.log(`Preview console [${consoleEvent.type}]:`, consoleEvent.message);
        }
      });
      
      // Return the cleanup function directly (not in the Promise chain)
      return () => {
        if (workspace) {
          workspace.dispose();
        }
        if (blocklyDiv) {
          const resizeObserver = new ResizeObserver(() => {});
          resizeObserver.disconnect();
        }
        previewSafety.cleanup();
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

    // Updated captureModifiedDom function
    function captureModifiedDom() {
      try {
        const iframe = document.querySelector('.preview-iframe') as HTMLIFrameElement;
        if (iframe?.contentWindow) {
          // Request the DOM from the iframe
          iframe.contentWindow.postMessage({ type: 'requestDOM' }, '*');
        }
      } catch (e) {
        console.error('Error requesting DOM:', e);
        modifiedDomString = '<!-- Error capturing DOM -->';
      }
    }

    // Update the event listener to handle DOM messages
    onMount(() => {
      const messageHandler = (event: MessageEvent) => {
        if (event.data?.source === 'preview-console') {
          const { type, message, timestamp } = event.data;
          console.log('Console captured:', type, message);
        } else if (event.data?.type === 'domContent') {
          // Receive the DOM content sent from iframe
          modifiedDomString = event.data.content;
          // Apply highlighting if DOM tab is active
          if (activeTab === 'dom') {
            applyHighlighting();
          }
        }
      };

      window.addEventListener('message', messageHandler);
      
      return () => {
        window.removeEventListener('message', messageHandler);
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

    // Apply syntax highlighting
    function applyHighlighting() {
      if (jsonContainer && jsonCode) {
        jsonContainer.innerHTML = Prism.highlight(jsonCode, Prism.languages.json, 'json');
      }
      
      if (htmlContainer && generatedCode) {
        console.log('Applying HTML highlighting. Original code length:', generatedCode.length);
        
        // First highlight as markup
        const highlighted = Prism.highlight(generatedCode, Prism.languages.markup, 'markup');
        console.log('Highlighted HTML code length:', highlighted.length);
        htmlContainer.innerHTML = highlighted;
        
        // Let Prism highlight any script and style elements
        console.log('Before additional highlighting:', htmlContainer.innerHTML.substring(0, 100) + '...');
        Prism.highlightAllUnder(htmlContainer);
        console.log('After additional highlighting:', htmlContainer.innerHTML.substring(0, 100) + '...');
        
        // Add classes to script and style tags
        const tagElements = htmlContainer.querySelectorAll('.token.tag');
        console.log('Found tag elements:', tagElements.length);
        tagElements.forEach(tag => {
          if (tag.textContent.includes('<script') || tag.textContent.includes('</script')) {
            tag.classList.add('script-tag');
            console.log('Added script-tag class to:', tag.textContent);
          }
          if (tag.textContent.includes('<style') || tag.textContent.includes('</style')) {
            tag.classList.add('style-tag');
            console.log('Added style-tag class to:', tag.textContent);
          }
        });
        
        // Find body start and content div
        let bodyStart = null;
        let contentDiv = null;
        let foundBody = false;
        
        // Find body tag and then the first div after it
        tagElements.forEach(tag => {
          if (tag.textContent.includes('<body')) {
            bodyStart = tag;
            foundBody = true;
            console.log('Found body tag:', tag.textContent);
          } else if (foundBody && tag.textContent.includes('<div') && !contentDiv) {
            // This will be the first div after body
            contentDiv = tag;
            contentDiv.classList.add('main-content');
            console.log('Found and styled main content div:', tag.textContent);
          }
        });
      }
      
      if (domContainer && modifiedDomString) {
        const highlighted = Prism.highlight(modifiedDomString, Prism.languages.markup, 'markup');
        domContainer.innerHTML = highlighted;
        Prism.highlightAllUnder(domContainer);
      }
    }
    
    // Update highlighting after the component updates
    afterUpdate(() => {
      applyHighlighting();
    });

    // Update setActiveTab function
    function setActiveTab(tab: 'blocks'|'json'|'code'|'preview'|'dom') {
      activeTab = tab;
      
      if (tab === 'blocks' && workspace) {
        resize();
      }
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
          on:click={() => {
            activeTab = 'preview';
            // Reset the preview iframe when switching to preview tab
            const iframe = document.querySelector('.preview-iframe') as HTMLIFrameElement;
            if (iframe) previewSafety.resetPreview(iframe);
          }}>
          Preview
        </button>

        <!-- NEW: DOM tab -->
        <button 
          class="tab-button {activeTab === 'dom' ? 'active' : ''}" 
          on:click={() => { activeTab = 'dom'; captureModifiedDom(); }}> 
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
      
      <!-- JSON view -->
      <div class="code-container" style="display: {activeTab === 'json' ? 'block' : 'none'}">
        <div class="action-buttons">
          <button on:click={() => copyToClipboard(jsonCode)}>Copy JSON Code</button>
          <button on:click={() => downloadFile(jsonCode, 'component.json')}>Download JSON File</button>
          <button on:click={importJsonFile}>Import JSON File</button>
        </div>
        <pre class="code-display"><code bind:this={jsonContainer} class="language-json"></code></pre>
      </div>
      
      <!-- HTML view -->
      <div class="code-container" style="display: {activeTab === 'code' ? 'block' : 'none'}">
        <div class="action-buttons">
          <button on:click={() => copyToClipboard(generatedCode)}>Copy HTML Code</button>
          <button on:click={() => downloadFile(generatedCode, 'component.html')}>Download HTML File</button>
        </div>
        <pre class="code-display"><code bind:this={htmlContainer} class="language-html"></code></pre>
      </div>

      <!-- Preview view - always present but hidden when not active -->
      <div class="preview-container" style="display: {activeTab === 'preview' ? 'block' : 'none'}">
        <div class="preview-controls">
          <button class="refresh-button" on:click={() => {
            const iframe = document.querySelector('.preview-iframe') as HTMLIFrameElement;
            if (iframe) previewSafety.resetPreview(iframe);
          }}>
            Refresh Preview
          </button>
          {#if previewSafety.hasError}
            <div class="preview-error-indicator">
              Error: {previewSafety.currentError?.message}
            </div>
          {/if}
        </div>
        <iframe
          class="preview-iframe"
          srcdoc={previewSafety.wrapCode(generatedCode + `
            <script>
              // Add listener for DOM request
              window.addEventListener('message', (event) => {
                if (event.data?.type === 'requestDOM') {
                  // Send the DOM content back to parent
                  window.parent.postMessage({
                    type: 'domContent',
                    content: document.documentElement.outerHTML
                  }, '*');
                }
              });
            </script>
          `)}
          sandbox="allow-scripts" 
          title="Component Preview"
          on:load={previewSafety.handlePreviewLoad}
        ></iframe>
      </div>

      <!-- DOM view without refresh button -->
      <div class="code-container" style="display: {activeTab === 'dom' ? 'block' : 'none'}">
        <pre class="code-display"><code bind:this={domContainer} class="language-html"></code></pre>
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
    
    .code-display {
      margin: 0;
      white-space: pre-wrap;
      font-family: monospace;
      font-size: 14px;
      background-color: white;
    }
    
    /* Add custom styling for script sections */
    :global(.code-display .token.tag.script-tag),
    :global(.code-display .language-javascript) {
      background-color: rgba(255, 240, 200, 0.2); /* Light yellow background */
    }

    :global(.code-display .token.tag.script-tag .token.tag) {
      color: #905; /* Reddish color for the actual script tag */
    }
   
    :global(.code-display code.language-html) {
      background-color: #f8f8f8;
    }

/* Style only script tags with the left border, not all tags 

:global(.code-display .token.tag.script-tag),
:global(.code-display .token.tag:has(.token.tag[content="script"])),
:global(.code-display .token.script) {
  border-left: 4px solid #f0db4f;
  margin-left: 2px;
  padding-left: 8px;

*/
    
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

    .code-display code {
      display: block;
      width: 100%;
      height: 100%;
      margin: 0;
      white-space: pre-wrap;
      font-family: monospace;
      font-size: 14px;
    }

    /* Target script sections */
    
    :global(.code-display .token.script) {
      background-color: rgba(255, 240, 200, 0.3);
      display: block;
      border-left: 4px solid #f0db4f;
      padding-left: 8px;
      margin: 4px 0;
    }

    /* Style tags and content - using purple theme */
:global(.code-display .token.style) {
  background-color: rgba(240, 200, 255, 0.2);
  display: block;
  border-left: 4px solid #9c27b0;
  padding-left: 8px;
  margin: 4px 0;
}

/* Body section - using a subtle blue-green theme */
:global(.code-display .body-tag) {
  border-left: 4px solid #4caf50;
  padding-left: 8px;
  background-color: rgba(200, 255, 240, 0.1);
}

/* Between the body tags, we want a subtle indicator */
:global(.code-display .body-tag:first-of-type) ~ :global(.token):not(:global(.body-tag)) {
  border-left: 1px solid rgba(76, 175, 80, 0.3);
  padding-left: 8px;
  margin-left: 3px;
}
      

    /* Target script opening and closing tags */
    :global(.code-display .token.tag .token.tag) {
      /* Basic styling for all tags */
      display: inline-block;
    }

    /* Special styling for script tags */
    :global(.code-display .token.tag .token.tag:first-child + .token.punctuation) {
      /* This gets the closing > of the tag */
      display: inline-block;
    }

    /* Style JavaScript tokens inside script */
    :global(.code-display .token.script .token.string) {
      color: #690; /* Strings in green */
    }

    :global(.code-display .token.script .token.keyword) {
      color: #07a; /* Keywords in blue */
    }

    :global(.code-display .token.script .token.function) {
      color: #dd4a68; /* Functions in pink */
    }

    /* Style script tags */
    :global(.code-display .script-tag) {
      background-color: rgba(255, 240, 200, 0.3);
    }

    /* Main content area highlighting */
    :global(.code-display .main-content-start) {
      border-top: 2px solid #4caf50;
      margin-top: 8px;
      padding-top: 8px;
    }

    :global(.code-display .main-content-area) {
      border-left: 2px solid rgba(76, 175, 80, 0.3);
      margin-left: 4px;
      padding-left: 8px;
    }

    :global(.code-display .main-content-end) {
      border-bottom: 2px solid #4caf50;
      margin-bottom: 8px;
      padding-bottom: 8px;
    }

    /* Main content div highlighting */
    :global(.code-display .main-content) {
      border-left: 3px solid #4caf50;
      padding-left: 8px;
      background-color: rgba(76, 175, 80, 0.05);
      display: block;
    }

  </style> 
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
    import { drawSelection } from '@codemirror/view';
  
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
    
    let jsonCode = '';
    let generatedCode = '';
    let activeTab: 'blocks'|'json'|'code'|'preview'|'dom' = initialTab;
    let componentsLoaded = false;
    let modifiedDomString = '';
    
    // CodeMirror editor instances
    let jsonEditor: EditorView;
    let htmlEditor: EditorView;
    let domEditor: EditorView;
  
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
        cleanupEditors();
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
            console.log('Applying highlighting');
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

    // Update applyHighlighting function to use CodeMirror instead of Prism
    function applyHighlighting() {
      if (jsonContainer && jsonCode && !jsonEditor) {
        jsonEditor = new EditorView({
          state: EditorState.create({
            doc: jsonCode,
            extensions: [basicSetup, json(), drawSelection()]
          }),
          parent: jsonContainer
        });
      } else if (jsonEditor && jsonCode) {
        jsonEditor.dispatch({
          changes: { from: 0, to: jsonEditor.state.doc.length, insert: jsonCode }
        });
      }
      
      if (htmlContainer && generatedCode && !htmlEditor) {
        htmlEditor = new EditorView({
          state: EditorState.create({
            doc: generatedCode,
            extensions: [basicSetup, html(), drawSelection()]
          }),
          parent: htmlContainer
        });
      } else if (htmlEditor && generatedCode) {
        htmlEditor.dispatch({
          changes: { from: 0, to: htmlEditor.state.doc.length, insert: generatedCode }
        });
      }
      
      if (domContainer && modifiedDomString && !domEditor) {
        domEditor = new EditorView({
          state: EditorState.create({
            doc: modifiedDomString,
            extensions: [basicSetup, html(), drawSelection()]
          }),
          parent: domContainer
        });
      } else if (domEditor && modifiedDomString) {
        domEditor.dispatch({
          changes: { from: 0, to: domEditor.state.doc.length, insert: modifiedDomString }
        });
      }
    }
    
    // Update setActiveTab function to handle editor resize
    function setActiveTab(tab: 'blocks'|'json'|'code'|'preview'|'dom') {
      activeTab = tab;
      
      if (tab === 'blocks' && workspace) {
        resize();
      }
      
      // Give editors time to render then refresh them
      setTimeout(() => {
        if (tab === 'json' && jsonEditor) jsonEditor.requestMeasure();
        if (tab === 'code' && htmlEditor) {
          htmlEditor.requestMeasure();
          applyCommentHighlighting();
        }
        if (tab === 'dom' && domEditor) {
          domEditor.requestMeasure();
          applyCommentHighlighting();
        }
      }, 10);
    }

    // Cleanup function to destroy editor instances
    function cleanupEditors() {
      if (jsonEditor) jsonEditor.destroy();
      if (htmlEditor) htmlEditor.destroy();
      if (domEditor) domEditor.destroy();
    }

    // Replace the applyCommentHighlighting function with this improved version
    function applyCommentHighlighting() {
      // Do the initial highlighting
      setTimeout(() => {
        const commentSpans = document.querySelectorAll('.cm-content .ͼm');
        
        commentSpans.forEach(span => {
          const text = span.textContent.trim();
          
          // Add data attributes based on content
          if (text.includes('@BEGIN: STYLE_BLOCKS') || text.includes('@END: STYLE_BLOCKS')) {
            span.setAttribute('data-comment-type', 'style');
          } else if (text.includes('@BEGIN: CONTENT_BLOCKS') || text.includes('@END: CONTENT_BLOCKS')) {
            span.setAttribute('data-comment-type', 'content');
          } else if (text.includes('@BEGIN: SCRIPT_BLOCKS') || text.includes('@END: SCRIPT_BLOCKS')) {
            span.setAttribute('data-comment-type', 'script');
          } else if (text.includes('@BEGIN: ONLOAD_SCRIPTS') || text.includes('@END: ONLOAD_SCRIPTS')) {
            span.setAttribute('data-comment-type', 'onload');
          } else if (text.includes('Bootstrap')) {
            span.setAttribute('data-comment-type', 'bootstrap');
          }
        });
      }, 100);
    }

    // Instead of attaching event listeners directly to the editor,
    // use Svelte's lifecycle hooks and components to manage interaction
    afterUpdate(() => {
      if (activeTab === 'code' || activeTab === 'dom') {
        applyCommentHighlighting();
      }
    });

    // Use onMount to set up a mutation observer that watches for editor changes
    onMount(() => {
      const observer = new MutationObserver((mutations) => {
        if (activeTab === 'code' || activeTab === 'dom') {
          applyCommentHighlighting();
        }
      });
      
      // Start observing the document with the configured parameters
      observer.observe(document.body, { childList: true, subtree: true });
      
      return () => observer.disconnect(); // Clean up on component unmount
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
        <div class="editor-wrapper">
          <CodeMirror
            bind:value={jsonCode}
            lang={json()}
            readonly={false}
            extensions={[drawSelection()]}
          />
        </div>
      </div>
      
      <!-- HTML view -->
      <div class="code-container" style="display: {activeTab === 'code' ? 'block' : 'none'}">
        <div class="action-buttons">
          <button on:click={() => copyToClipboard(generatedCode)}>Copy HTML Code</button>
          <button on:click={() => downloadFile(generatedCode, 'component.html')}>Download HTML File</button>
        </div>
        <div class="editor-wrapper">
          <CodeMirror
            bind:value={generatedCode}
            lang={html()}
            readonly={false}
            extensions={[drawSelection()]}
          />
        </div>
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
        <div class="editor-wrapper">
          <CodeMirror
            bind:value={modifiedDomString}
            lang={html()}
            readonly={true}
            styles={{
              "&": {
                height: "100%",
              },
              ".cm-scroller": {
                overflow: "auto"
              }
            }}
            extensions={[drawSelection()]}
          />
        </div>
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

    :global(.code-display .main-content-parent) {
      border-left: 3px solid #4caf50;
      padding-left: 8px;
      background-color: rgba(76, 175, 80, 0.05);
      display: block;
    }

    /* Replace editor-container with editor-wrapper */
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

    /* Remove the CodeMirror-specific global styles since the component handles this */
    :global(.cm-content) {
      font-size: 14px;
      font-family: monospace;
      line-height: 1.5;
      font-weight: normal;
      background-color: #fefefe;
    }

 /*
    :global(.ͼm) {
      font-style: italic;
      padding: 0 2px;
      border-radius: 2px;
      box-sizing: border-box;
      color: #008000; 
      
    }
      */

    /* Keep your existing .ͼm styling */
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
    
    /*
    :global(.ͼm[data-comment-type="bootstrap"]) {
      color: #800000; 
      background-color: rgba(255, 240, 240, 0.8);
      border: 1px solid #800000;
    }
      */

  </style> 
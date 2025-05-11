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
    import { documentContext } from '$lib/utils/document-context.js';

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
        try {
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
          
          // Only process UI events that might change field values
          if (event.type === Blockly.Events.BLOCK_CHANGE && workspace) {
            const changeEvent = event as Blockly.Events.BlockChange;
            
            // Find document blocks
            const documentBlocks = workspace.getBlocksByType('web_document');
            
            if (documentBlocks.length > 0) {
              const docBlock = documentBlocks[0]; // First document block
              
              console.log('Document block change detected:', {
                eventType: event.type,
                blockId: changeEvent.blockId,
                fieldName: changeEvent.name,
                docBlockId: docBlock.id
              });
              
              // Update context when relevant fields change
              if (changeEvent.blockId === docBlock.id) {
                const useBootstrap = docBlock.getFieldValue('USE_BOOTSTRAP') === 'TRUE';
                const theme = docBlock.getFieldValue('THEME');
                
                console.log('Document settings changed:', {
                  useBootstrap,
                  theme,
                  fieldChanged: changeEvent.name
                });
                
                documentContext.updateSettings({
                  useBootstrap,
                  theme
                });
                
                console.log('Updated document context:', documentContext.getSettings());
                
                // May need to regenerate code to reflect the change
                if (changeEvent.name === 'USE_BOOTSTRAP') {
                  console.log('Bootstrap toggle changed, regenerating code');
                  // Trigger regeneration of code
                  generatedCode = javascriptGenerator.workspaceToCode(workspace);
                }
              }
            }
          }
        });
  
          // Handle resize
          const resizeObserver = new ResizeObserver(() => {
            Blockly.svgResize(workspace!);
          });
          resizeObserver.observe(blocklyDiv);
          
          // Initialize blockly overrides
          initializeBlocklyOverrides(workspace);
          
          componentsLoaded = true;
        } catch (error) {
          console.error('Error initializing Blockly workspace:', error);
        }
      })();
      
      // Set up preview safety event listeners
      previewSafety.addEventListeners((event) => {
        if ('type' in event && (event.type === 'error' || event.type === 'timeout' || event.type === 'infiniteLoop')) {
          console.error('Preview error:', event.message);
        } else {
          const consoleEvent = event as ConsoleMessage;
          console.log(`Preview console [${consoleEvent.type}]:`, consoleEvent.message);
        }
      });
      
      // Set up DOM content message listener
      const messageHandler = (event: MessageEvent) => {
        if (event.data?.source === 'preview-console') {
          const { type, message } = event.data;
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
        window.removeEventListener('message', messageHandler);
      };
    });
    
    // Function to clean up editor instances
    function cleanupEditors() {
      // The Svelte CodeMirror components will be cleaned up automatically
      // This is only kept for API compatibility with code that might call it
    }
    
    // Function to resize the Blockly workspace
    function resize(): void {
      if (workspace) Blockly.svgResize(workspace);
    }

    // Function to handle importing JSON files
    function importJsonFile(): void {
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

    // Function to load workspace from JSON
    export function loadFromJson(jsonString: string): void {
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

    // Function to apply comment highlighting
    function applyCommentHighlighting(): void {
      setTimeout(() => {
        const commentSpans = document.querySelectorAll('.cm-content .ͼm');
        
        commentSpans.forEach(span => {
          const text = span.textContent?.trim() || '';
          
          // Add data attributes based on content
          if (text.includes('@BEGIN: STYLE_BLOCKS') || text.includes('@END: STYLE_BLOCKS')) {
            span.setAttribute('data-comment-type', 'style');
          } else if (text.includes('@BEGIN: CONTENT_BLOCKS') || text.includes('@END: CONTENT_BLOCKS')) {
            span.setAttribute('data-comment-type', 'content');
          } else if (text.includes('@BEGIN: SCRIPT_BLOCKS') || text.includes('@END: SCRIPT_BLOCKS')) {
            span.setAttribute('data-comment-type', 'script');
          } else if (text.includes('@BEGIN: ONLOAD_SCRIPTS') || text.includes('@END: ONLOAD_SCRIPTS')) {
            span.setAttribute('data-comment-type', 'onload');
          }
        });
      }, 100);
    }

    // Update the setActiveTab function to also handle comment highlighting
    function setActiveTab(tab: 'blocks'|'json'|'code'|'preview'|'dom'): void {
      activeTab = tab;
      
      if (tab === 'blocks' && workspace) {
        resize();
      }
      
      // Give editors time to render then refresh them
      setTimeout(() => {
        if (tab === 'json' || tab === 'code' || tab === 'dom') {
          applyHighlighting();
          if (tab === 'code' || tab === 'dom') {
            applyCommentHighlighting();
          }
        }
        
        // Handle DOM tab special case
        if (tab === 'dom') {
          captureModifiedDom();
        } else if (tab === 'preview') {
          // Reset the preview iframe when switching to preview tab
          const iframe = document.querySelector('.preview-iframe') as HTMLIFrameElement;
          if (iframe) previewSafety.resetPreview(iframe);
        }
      }, 10);
    }

    // Function to apply syntax highlighting to the editors
    function applyHighlighting() {
      // We can remove this function's implementation since we're using Svelte CodeMirror components
      // The syntax highlighting is now handled by the components automatically
      // This is only kept for API compatibility with code that might call it
    }
    
    // Ensure highlighting is applied when components update
    afterUpdate(() => {
      if ((activeTab === 'json' || activeTab === 'code' || activeTab === 'dom') && componentsLoaded) {
        applyHighlighting();
      }
    });

    // Function to capture modified DOM from the preview
    function captureModifiedDom(): void {
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

    // Setup message listener for DOM capture
    onMount(() => {
      const messageHandler = (event: MessageEvent) => {
        if (event.data?.source === 'preview-console') {
          const { type, message } = event.data;
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
    async function copyToClipboard(text: string): Promise<void> {
      try {
        await navigator.clipboard.writeText(text);
        alert('Copied to clipboard');
      } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy to clipboard');
      }
    }
    
    // Function to download text as a file
    function downloadFile(content: string, defaultFilename: string): void {
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

    // Set up a mutation observer to watch for editor changes
    onMount(() => {
      const observer = new MutationObserver(() => {
        if (activeTab === 'code' || activeTab === 'dom') {
          applyCommentHighlighting();
        }
      });
      
      // Start observing the document with the configured parameters
      observer.observe(document.body, { childList: true, subtree: true });
      
      return () => observer.disconnect(); // Clean up on component unmount
    });

    // Export methods for public API
    export function getCode(): string {
      if (!workspace) return '';
      return javascriptGenerator.workspaceToCode(workspace);
    }
  
    export function getJson(): string {
      if (!workspace) return '';
      return generateJsonCode(workspace);
    }
  
    export function getXml(): string {
      if (!workspace) return '';
      const xml = Blockly.Xml.workspaceToDom(workspace);
      return Blockly.Xml.domToText(xml);
    }
  
    export function setXml(xmlText: string): void {
      if (!workspace) return;
      try {
        workspace.clear();
        const xml = Blockly.utils.xml.textToDom(xmlText);
        Blockly.Xml.domToWorkspace(xml, workspace);
      } catch (e) {
        console.error('Error setting XML', e);
      }
    }

    export function clearWorkspace(): void {
      if (workspace) workspace.clear();
    }

    // Function to generate the DOM capture script
    function getDomCaptureScript(): string {
      return `
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
        </` + `script>
      `;
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

    <!-- Preview view -->
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
        srcdoc={previewSafety.wrapCode(generatedCode + getDomCaptureScript())}
        sandbox="allow-scripts" 
        title="Component Preview"
        on:load={() => previewSafety.handlePreviewLoad()}
      ></iframe>
    </div>

    <!-- DOM view -->
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

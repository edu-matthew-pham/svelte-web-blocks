<script lang="ts">
    import BlocklyWorkspace from '$lib/BlocklyWorkspace.svelte';
    import { onMount } from 'svelte';
    
    // Simple options
    const workspaceOptions = {
      zoom: {
        controls: true,
        startScale: 1.0
      }
    };
    
    // Export these variables for parent components to bind to
    export let generatedHtml = '';
    export let generatedJson = '';
    let blocklyWorkspace;
    
    // Custom type for event
    type BlocklyChangeEvent = {
      detail: {
        code: string;
        json: string;
        xml: string;
        event: any;
      }
    };
    
    // Listen for changes to update preview
    function handleChange(event: BlocklyChangeEvent) {
      generatedHtml = event.detail.code;
      generatedJson = event.detail.json;
    }
    
    // Initialize preview iframe content
    let previewFrame: HTMLIFrameElement;
    $: if (previewFrame && generatedHtml) {
      updatePreview(generatedHtml);
    }
    
    function updatePreview(html: string) {
      const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow!.document;
      frameDoc.open();
      frameDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: sans-serif; padding: 10px; }
            </style>
          </head>
          <body>${html}</body>
        </html>
      `);
      frameDoc.close();
    }
</script>

<div class="workspace-container">
  <BlocklyWorkspace 
    workspaceOptions={workspaceOptions}
    bind:this={blocklyWorkspace}
    on:change={handleChange}
  />
</div>

<div class="preview-container">
  <h3>Web Preview</h3>
  <iframe bind:this={previewFrame} title="Web Preview" class="preview-frame"></iframe>
</div>

<style>
  .workspace-container {
    height: 450px;
    margin-bottom: 20px;
  }
  
  .preview-container {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
  }
  
  .preview-frame {
    width: 100%;
    height: 300px;
    border: 1px solid #eee;
    background: white;
  }
  
  h3 {
    margin-top: 0;
    margin-bottom: 10px;
  }
</style>
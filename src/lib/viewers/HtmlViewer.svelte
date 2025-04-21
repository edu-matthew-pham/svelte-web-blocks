<script lang="ts">
  import CodeViewer from '../CodeViewer.svelte';
  import { onMount } from 'svelte';

  // Base props (pass through to CodeViewer)
  export let code: string = '';
  export let lineNumbers: boolean = false;
  export let wrapText: boolean = true;
  export let fontSize: string = '14px';
  
  // HTML specific props
  export let showPreview: boolean = true;
  
  let previewVisible: boolean = false;
  let sanitizedHtml: string = '';
  
  // Basic HTML sanitization (you might want a more robust solution for production)
  function sanitizeHtml(html: string): string {
    // Very basic sanitization - in production use a proper sanitizer
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/g, '')
      .replace(/on\w+='[^']*'/g, '');
  }
  
  function togglePreview() {
    previewVisible = !previewVisible;
    if (previewVisible) {
      sanitizedHtml = sanitizeHtml(code);
    }
  }
  
  // Ensure sanitization happens when code changes
  $: if (code && previewVisible) {
    sanitizedHtml = sanitizeHtml(code);
  }
  
  onMount(() => {
    if (showPreview) {
      previewVisible = true;
      sanitizedHtml = sanitizeHtml(code);
    }
  });
</script>

<div class="html-viewer">
  <div class="tabs">
    <button class="tab-button" class:active={!previewVisible} on:click={() => previewVisible = false}>
      Code
    </button>
    <button class="tab-button" class:active={previewVisible} on:click={togglePreview} disabled={!showPreview}>
      Preview
    </button>
  </div>
  
  <div class="viewer-content">
    {#if previewVisible}
      <div class="preview-container">
        {@html sanitizedHtml}
      </div>
    {:else}
      <CodeViewer
        {code}
        language="html"
        {lineNumbers}
        {wrapText}
        {fontSize}
      >
        <div slot="toolbar-end">
          <button class="preview-button" on:click={togglePreview} disabled={!showPreview}>
            Show Preview
          </button>
        </div>
      </CodeViewer>
    {/if}
  </div>
</div>

<style>
  .html-viewer {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .tabs {
    display: flex;
    background-color: #f8f8f8;
    border-bottom: 1px solid #ddd;
  }
  
  .tab-button {
    padding: 8px 16px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 0.9rem;
    border-bottom: 2px solid transparent;
  }
  
  .tab-button.active {
    border-bottom: 2px solid #2563eb;
    font-weight: bold;
  }
  
  .tab-button:hover:not(.active) {
    background-color: #eee;
  }
  
  .preview-container {
    padding: 16px;
    background-color: white;
    min-height: 200px;
    overflow: auto;
  }
  
  .preview-button {
    border: none;
    background: #4b5563;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
  }
  
  .viewer-content {
    width: 100%;
  }
</style> 
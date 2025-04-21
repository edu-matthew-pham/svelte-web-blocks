<script lang="ts">
  import CodeViewer from '../CodeViewer.svelte';
  import { onMount } from 'svelte';

  // Base props (pass through to CodeViewer)
  export let code: string = '';
  export let lineNumbers: boolean = false;
  export let wrapText: boolean = false;
  export let fontSize: string = '14px';
  
  // JSON specific props
  export let prettify: boolean = true;
  export let indentation: number = 2;
  
  let isValid: boolean = true;
  let prettyCode: string = '';
  let rawCode: string = '';
  let showRaw: boolean = false;
  
  // Process JSON on input change
  function processJson() {
    rawCode = code;
    
    try {
      // Try to parse the JSON to validate it
      let parsedJson = JSON.parse(code);
      isValid = true;
      
      // Apply pretty printing if enabled
      if (prettify) {
        prettyCode = JSON.stringify(parsedJson, null, indentation);
      } else {
        prettyCode = code;
      }
    } catch (e) {
      isValid = false;
      prettyCode = code; // Keep original on error
      console.error('Invalid JSON:', e);
    }
  }
  
  function toggleView() {
    showRaw = !showRaw;
  }
  
  // Watch for code changes
  $: if (code) {
    processJson();
  }
  
  onMount(() => {
    processJson();
  });
</script>

<div class="json-viewer">
  <CodeViewer
    code={showRaw ? rawCode : prettyCode}
    language="json"
    {lineNumbers}
    {wrapText}
    {fontSize}
  >
    <div slot="toolbar-start" class="json-controls">
      <div class="status-indicator" class:valid={isValid} class:invalid={!isValid}>
        {isValid ? '✓ Valid JSON' : '✗ Invalid JSON'}
      </div>
    </div>
    
    <div slot="toolbar-end">
      <button class="format-button" on:click={toggleView}>
        {showRaw ? 'Show Formatted' : 'Show Raw'}
      </button>
      {#if isValid && !showRaw}
        <select bind:value={indentation} on:change={processJson}>
          <option value={2}>2 Spaces</option>
          <option value={4}>4 Spaces</option>
          <option value={8}>8 Spaces</option>
        </select>
      {/if}
    </div>
  </CodeViewer>
</div>

<style>
  .json-viewer {
    width: 100%;
  }
  
  .json-controls {
    display: flex;
    align-items: center;
  }
  
  .status-indicator {
    font-size: 0.8rem;
    padding: 2px 6px;
    border-radius: 4px;
  }
  
  .valid {
    background-color: #d1fae5;
    color: #065f46;
  }
  
  .invalid {
    background-color: #fee2e2;
    color: #b91c1c;
  }
  
  .format-button {
    border: none;
    background: #4b5563;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    margin-right: 8px;
    cursor: pointer;
    font-size: 0.8rem;
  }
  
  select {
    padding: 3px;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 0.8rem;
  }
</style> 
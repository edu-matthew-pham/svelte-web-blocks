<script lang="ts">
    import { onMount } from 'svelte';
    import { convertHTMLToPug } from '$lib/blocks/pugTemplates.js';
    import Prism from 'prismjs';
    import 'prismjs/components/prism-pug.js';
    
    let htmlInput = `<div class="container">
  <div class="row">
    <div class="col-md-6">
      <h1>Hello World</h1>
      <p>This is a paragraph</p>
    </div>
  </div>
</div>`;
    let pugOutput = '';
    let isLoading = false;
    let error = '';
    
    // Highlighted versions of the code
    let highlightedHtml = '';
    let highlightedPug = '';
    
    // Update highlighted HTML whenever input changes
    $: {
        highlightedHtml = Prism.highlight(htmlInput, Prism.languages.html, 'html');
    }
    
    // Update highlighted Pug whenever output changes
    $: {
        highlightedPug = pugOutput ? Prism.highlight(pugOutput, Prism.languages.pug, 'pug') : '';
    }
    
    // Initialize Prism on mount
    onMount(() => {
        // Initial highlighting
        highlightedHtml = Prism.highlight(htmlInput, Prism.languages.html, 'html');
    });
    
    async function convertToPug() {
        isLoading = true;
        error = '';
        
        try {
            pugOutput = await convertHTMLToPug(htmlInput);
        } catch (err) {
            error = err instanceof Error ? err.message : 'Unknown error occurred';
            console.error(err);
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="converter-container">
    <div class="input-section">
        <h3>HTML Input</h3>
        <div class="code-editor">
            <textarea bind:value={htmlInput} rows="10"></textarea>
            <pre class="code-preview"><code class="language-html">{@html highlightedHtml}</code></pre>
        </div>
    </div>
    
    <div class="controls">
        <button on:click={convertToPug} disabled={isLoading}>
            {isLoading ? 'Converting...' : 'Convert to Pug'}
        </button>
    </div>
    
    <div class="output-section">
        <h3>Pug Output</h3>
        {#if error}
            <div class="error">{error}</div>
        {/if}
        <pre class="code-output"><code class="language-pug">{@html highlightedPug}</code></pre>
    </div>
</div>

<style>
    .converter-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    .code-editor {
        position: relative;
        width: 100%;
    }
    
    textarea {
        width: 100%;
        font-family: monospace;
        padding: 10px;
        border: 1px solid #ddd;
        background: transparent;
        color: transparent;
        caret-color: black;
        resize: none;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        z-index: 1;
    }
    
    .code-preview {
        margin: 0;
        padding: 10px;
        border: 1px solid #ddd;
        background: #f5f5f5;
        min-height: 200px;
        font-family: monospace;
        white-space: pre-wrap;
        pointer-events: none;
    }
    
    .code-output {
        margin: 0;
        padding: 10px;
        border: 1px solid #ddd;
        background: #f5f5f5;
        min-height: 200px;
        font-family: monospace;
        white-space: pre-wrap;
    }
    
    .controls {
        display: flex;
        justify-content: center;
    }
    
    button {
        padding: 8px 16px;
        font-size: 16px;
        border: 1px solid #ccc;
    }
    
    .error {
        color: red;
        margin-bottom: 10px;
    }
</style> 
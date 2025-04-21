<script lang="ts">
  import { onMount } from 'svelte';

  // Base props
  export let code: string = '';
  export let language: string = 'text';
  export let lineNumbers: boolean = false;
  export let wrapText: boolean = false;
  export const readOnly: boolean = true;
  export let fontSize: string = '14px';
  export const theme: string = 'default';
  
  // Optional highlighting - can be implemented by extending components
  export const highlightCode: boolean = false;

  // Internal state
  let codeElement: HTMLElement;

  // Copy code to clipboard
  function copyToClipboard() {
    navigator.clipboard.writeText(code)
      .then(() => {
        const copyButton = document.querySelector('.copy-button');
        if (copyButton) {
          const originalText = copyButton.textContent;
          copyButton.textContent = 'Copied!';
          setTimeout(() => {
            copyButton.textContent = originalText;
          }, 2000);
        }
      })
      .catch(err => {
        console.error('Failed to copy code:', err);
      });
  }

  // Function to add line numbers - simple version
  function getCodeWithLineNumbers(code: string): string[] {
    if (!code) return [];
    return code.split('\n');
  }
</script>

<div class="code-viewer" style="--font-size: {fontSize};">
  <div class="viewer-toolbar">
    <slot name="toolbar-start"></slot>
    <div class="spacer"></div>
    <button class="copy-button" on:click={copyToClipboard}>
      Copy
    </button>
    <slot name="toolbar-end"></slot>
  </div>

  <pre class:wrap={wrapText} class="language-{language}">
    <code bind:this={codeElement} class="language-{language}">
      {#if lineNumbers}
        {#each getCodeWithLineNumbers(code) as line, i}
          <div class="line">
            <span class="line-number">{i + 1}</span>
            <span class="line-content">{line}</span>
          </div>
        {/each}
      {:else}
        {code}
      {/if}
    </code>
  </pre>
</div>

<style>
  .code-viewer {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    background-color: #f8f8f8;
    font-family: 'Fira Code', 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace;
  }

  .viewer-toolbar {
    display: flex;
    align-items: center;
    padding: 8px;
    background: #eee;
    border-bottom: 1px solid #ddd;
  }

  .spacer {
    flex-grow: 1;
  }

  .copy-button {
    border: none;
    background: #2563eb;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
  }

  .copy-button:hover {
    background: #1d4ed8;
  }

  pre {
    margin: 0;
    padding: 12px;
    font-size: var(--font-size);
    overflow: auto;
    max-height: 500px;
  }

  pre.wrap {
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  code {
    font-family: inherit;
  }

  /* Line numbers styling */
  .line {
    display: flex;
    white-space: pre;
  }

  .line-number {
    user-select: none;
    text-align: right;
    color: #999;
    padding-right: 0.5em;
    margin-right: 0.5em;
    border-right: 1px solid #ddd;
    min-width: 2.5em;
  }

  .line-content {
    flex: 1;
  }
</style> 
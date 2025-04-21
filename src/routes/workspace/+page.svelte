<script>
    import BlocklyWorkspaceWithPreview from '$lib/BlocklyWorkspaceWithPreview.svelte';
    
    // Variables to store generated code
    let htmlOutput = '';
    let jsonOutput = '';
    
    // Function to log JSON to console
    function logJson() {
        console.log(jsonOutput);
    }
    
    // Function to download JSON
    function downloadJson() {
        const blob = new Blob([jsonOutput], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'blockly-workspace.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
</script>

<div class="workspace-container">
  <BlocklyWorkspaceWithPreview 
    bind:generatedHtml={htmlOutput}
    bind:generatedJson={jsonOutput}
  />
</div>

<div class="json-actions">
  <button on:click={logJson}>Log JSON to Console</button>
  <button on:click={downloadJson}>Download JSON</button>
</div>

<style>

  .json-actions {
    margin-top: 16px;
    display: flex;
    gap: 10px;
  }
  
  button {
    padding: 8px 16px;
    background-color: #4285f4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
  
  button:hover {
    background-color: #3367d6;
  }
</style>
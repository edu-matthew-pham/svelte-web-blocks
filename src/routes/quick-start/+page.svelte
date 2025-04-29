<script lang="ts">
    import BlocklyEditor from '$lib/components/workspace/BlocklyEditor.svelte';
    import { onMount } from 'svelte';
    
    let editor: BlocklyEditor;
    let jsonInput = '';
    
    function handleEditorChange(event: CustomEvent<{json: string, code?: string, xml?: string}>) {
        // Update JSON display when workspace changes
        if (event.detail && event.detail.json) {
            jsonInput = event.detail.json;
        }
    }
    
    function loadJson() {
        if (editor && jsonInput) {
            editor.loadFromJson(jsonInput);
        }
    }
    
    function clearWorkspace() {
        if (editor) {
            editor.clearWorkspace();
        }
    }
</script>

<div class="container">
    
    <main>
        <div class="editor-container">
            <BlocklyEditor 
                bind:this={editor}
                showCodeView={true}
                showJsonView={true}
                on:change={handleEditorChange}
            />
        </div>
        
        <div class="controls">
            <h3>Editor Controls</h3>
            <div class="control-group">
                <button on:click={clearWorkspace}>Clear Workspace</button>
                <button on:click={loadJson}>Load from JSON</button>
            </div>
            <div class="json-input">
                <h4>Edit JSON</h4>
                <textarea bind:value={jsonInput} rows="10"></textarea>
                <p class="hint">Edit the JSON above and click "Load from JSON" to convert it to blocks</p>
            </div>
        </div>
    </main>
</div>

<style>
    .container {
        
        margin: 0 auto;
        padding: 20px;
    }
    
    .editor-container {
        height: 800px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
    }
    
    .controls {
        margin-top: 20px;
    }
    
    .control-group {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
    }
    
    button {
        padding: 8px 16px;
        background: #4285f4;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    
    button:hover {
        background: #3b78e7;
    }
    
    .json-input {
        margin-top: 15px;
    }
    
    textarea {
        width: 100%;
        font-family: monospace;
        border: 1px solid #ddd;
        padding: 8px;
    }
    
    .hint {
        font-size: 0.8rem;
        color: #666;
        margin-top: 5px;
    }
</style>
    
<script lang="ts">
    import JsonToBlocks from '$lib/examples/JsonToBlocks.svelte';
    import 'prismjs/themes/prism.css';
</script>

<div class="container">
    <h1>JSON to Blocks Example</h1>
    <p>This example demonstrates how to convert JSON structures into Blockly blocks.</p>
    
    <div class="blockly-container">
        <JsonToBlocks />
    </div>
</div>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }
    
    h1 {
        margin-bottom: 20px;
        font-size: 24px;
    }
    
    .blockly-container {
        height: 900px;
        border: 1px solid #ddd;
        border-radius: 4px;
        overflow: hidden;
    }
</style>
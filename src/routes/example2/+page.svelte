<script lang="ts">
    import BlocklyToJson from '$lib/examples/BlocklyToJson.svelte';
    import 'prismjs/themes/prism.css';
</script>

<div class="container">
    <h1>Blockly to JSON Example</h1>
    <p>This example demonstrates how to convert Blockly blocks to JSON.</p>
    
    <div class="blockly-container">
        <BlocklyToJson />
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

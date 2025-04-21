<script lang="ts">
    import BasicBlockly from '$lib/examples/BasicBlockly.svelte';
    import 'prismjs/themes/prism.css';
</script>

<div class="container">
    <h1>Basic Blockly Example</h1>
    <p>This example demonstrates how to use the basic Blockly component with web blocks.</p>
    
    <div class="blockly-container">
        <BasicBlockly />
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

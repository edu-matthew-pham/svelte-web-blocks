<script lang="ts">
    import { onMount } from 'svelte';
    import * as Blockly from 'blockly';
    import { javascriptGenerator } from 'blockly/javascript';
    import { webBlocks } from '$lib/blocks/definitions.js';
    import { webGenerators } from '$lib/blocks/generators.js';
    import { defaultToolbox } from '$lib/toolbox/default-toolbox.js';
    import Prism from 'prismjs';
    
    let blocklyDiv: HTMLDivElement;
    let workspace: Blockly.WorkspaceSvg;
    let generatedCode = '';
    let highlightedCode = '';
    
    // Update highlighted code whenever generatedCode changes
    $: {
        highlightedCode = Prism.highlight(generatedCode, Prism.languages.javascript, 'javascript');
    }
    
    onMount(() => {
        // Register web component blocks
        Object.entries(webBlocks).forEach(([name, block]) => {
            Blockly.Blocks[name] = block;
        });

        // Register web component generators
        Object.entries(webGenerators).forEach(([name, generator]) => {
            javascriptGenerator.forBlock[name] = generator.html;
        });
        
        // Initialize workspace
        workspace = Blockly.inject(blocklyDiv, {
            toolbox: defaultToolbox,
            scrollbars: true,
            trashcan: true,
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2
            }
        });
        
        // Add change listener
        workspace.addChangeListener(() => {
            if (!workspace.isDragging()) {
                generatedCode = javascriptGenerator.workspaceToCode(workspace);
            }
        });
    });
</script>

<div class="blockly-container">
    <div bind:this={blocklyDiv} class="blockly-workspace"></div>
    
    <div class="code-output">
        <h3>Generated HTML</h3>
        <pre><code class="language-javascript">{@html highlightedCode}</code></pre>
    </div>
</div>

<style>
    .blockly-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 600px;
    }
    
    .blockly-workspace {
        flex: 1;
        min-height: 400px;
        border: 1px solid #ccc;
    }
    
    .code-output {
        margin-top: 20px;
        border: 1px solid #ccc;
        padding: 10px;
    }
    
    pre {
        background: #f5f5f5;
        padding: 10px;
        overflow: auto;
        height: 600px;
        margin: 0;
    }
    
    code {
        font-family: monospace;
    }
</style> 
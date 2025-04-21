<script lang="ts">
    import { onMount } from 'svelte';
    import * as Blockly from 'blockly';
    import { javascriptGenerator } from 'blockly/javascript';
    import { webBlocks } from '$lib/blocks/definitions.js';
    import { webGenerators } from '$lib/blocks/generators.js';
    import { defaultToolbox } from '$lib/toolbox/default-toolbox.js';
    import Prism from 'prismjs';
    // Import JSON language support for Prism
    import 'prismjs/components/prism-json';
    
    let blocklyDiv: HTMLDivElement;
    let workspace: Blockly.WorkspaceSvg;
    let generatedJson = '';
    let highlightedJson = '';
    
    // Update highlighted code whenever generatedJson changes
    $: {
        highlightedJson = Prism.highlight(generatedJson, Prism.languages.json, 'json');
    }
    
    // Function to generate high-level JSON from workspace
    function generateHighLevelJson(workspace: Blockly.WorkspaceSvg): string {
        const topBlocks = workspace.getTopBlocks(true);
        const result = [];
        
        for (const block of topBlocks) {
            const generator = javascriptGenerator.forBlock[block.type];
            if (generator && generator.highLevel) {
                const jsonObj = generator.highLevel(block);
                if (jsonObj) {
                    result.push(jsonObj);
                }
            }
        }
        
        return JSON.stringify(result, null, 2);
    }
    
    onMount(() => {
        // Register web component blocks
        Object.entries(webBlocks).forEach(([name, block]) => {
            Blockly.Blocks[name] = block;
        });

        // Register web component generators
        Object.entries(webGenerators).forEach(([name, generator]) => {
            javascriptGenerator.forBlock[name] = generator.html;
            // Store highLevel function as a property on the generator
            if (generator.highLevel) {
                javascriptGenerator.forBlock[name].highLevel = generator.highLevel;
            }
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
                generatedJson = generateHighLevelJson(workspace);
            }
        });
    });
</script>

<div class="blockly-container">
    <div bind:this={blocklyDiv} class="blockly-workspace"></div>
    
    <div class="code-output">
        <h3>Generated JSON</h3>
        <pre><code class="language-json">{@html highlightedJson}</code></pre>
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
<script lang="ts">
    import { onMount } from 'svelte';
    import * as Blockly from 'blockly';
    import { javascriptGenerator } from 'blockly/javascript';
    import { webBlocks } from '$lib/blocks/definitions.js';
    import { webGenerators } from '$lib/blocks/generators.js';
    import { defaultToolbox } from '$lib/toolbox/default-toolbox.js';
    import { createBlocksFromJson } from '$lib/blocks/parser.js';
        import Prism from 'prismjs';
    import 'prismjs/components/prism-json.js';
    
    let blocklyDiv: HTMLDivElement;
    let workspace: Blockly.WorkspaceSvg;
    let jsonInput = `[
  {
    "type": "document",
    "properties": {
      "title": "My Web Page",
      "theme": "light"
    },
    "children": [
      {
        "type": "featureCards",
        "properties": {
          "title": "Our Features",
          "columns": 3,
          "backgroundColor": null
        },
        "children": [
          {
            "type": "featureCard",
            "properties": {
              "icon": "🚀",
              "title": "Fast and Reliable",
              "description": "Our platform is optimized for speed and uptime."
            }
          },
          {
            "type": "featureCard",
            "properties": {
              "icon": "💡",
              "title": "Intuitive Design",
              "description": "User-friendly interface that anyone can use."
            }
          },
          {
            "type": "featureCard",
            "properties": {
              "icon": "⚙️",
              "title": "Powerful Features",
              "description": "Advanced capabilities to meet all your needs."
            }
          }
        ]
      }
    ]
  }
]`;
    
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
            trashcan: true
        });
        
        // Automatically load the JSON when the component mounts
        loadJson();
    });
    
    function loadJson() {
        try {
            workspace.clear();
            createBlocksFromJson(workspace, jsonInput);
            Prism.highlightAll();
        } catch (error) {
            console.error("Error loading JSON:", error);
            alert("Error loading JSON. Check console for details.");
        }
    }
</script>

<div class="json-blocks-container">
    <div class="json-input">
        <h3>JSON Input</h3>
        <textarea bind:value={jsonInput} rows="15"></textarea>
        <button on:click={loadJson}>Load Blocks from JSON</button>
    </div>
    
    <div bind:this={blocklyDiv} class="blockly-workspace"></div>
</div>

<style>
    .json-blocks-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 600px;
    }
    
    .json-input {
        margin-bottom: 20px;
    }
    
    textarea {
        width: 100%;
        font-family: monospace;
    }
    
    button {
        margin-top: 10px;
        padding: 8px 16px;
        border: 1px solid #ccc;
    }
    
    .blockly-workspace {
        flex: 1;
        min-height: 400px;
        border: 1px solid #ccc;
    }

  
</style> 
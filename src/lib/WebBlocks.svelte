<script lang="ts">
    import { onMount, afterUpdate, createEventDispatcher } from 'svelte';
    import * as Blockly from 'blockly';
    import 'blockly/javascript';
    import { javascriptGenerator } from 'blockly/javascript';
    import { webBlocks } from '$lib/blocks/definitions.js';
    import { webGenerators } from '$lib/blocks/generators.js';
    import { defaultToolbox } from '$lib/toolbox/default-toolbox.js';
    import { WorkspaceSvg } from 'blockly';
    import { createBlocksFromJson } from '$lib/blocks/parser.js';
    import { convertHTMLToPug } from '$lib/blocks/pugTemplates.js';
    
    // Import Prism for syntax highlighting
    import Prism from 'prismjs';
    import 'prismjs/themes/prism.css';
    // Import language support
    import 'prismjs/components/prism-json';
    import 'prismjs/components/prism-markup';
    import 'prismjs/components/prism-pug';

    export let code = '';
    export let highLevelCode = '';
    export let toolbox: string = defaultToolbox;
    export let theme: string = 'default';
    export let readOnly = false;
    
    // Tab state management
    export let showTabs = true; // Can be disabled if needed
    let activeTab = 'blocks'; // 'blocks', 'highlevel', 'code', or 'pug'
    
    // Added pug code state
    let pugCode = '';
    // Flag to track if pug needs to be regenerated
    let pugNeedsUpdate = true;

    let blocklyDiv: HTMLDivElement;
    let workspace: Blockly.WorkspaceSvg | undefined;
    let containerEl: HTMLDivElement;

    const dispatch = createEventDispatcher();

    // Add these variables with your other state
    let showRawCode = true;
    let showComments = false;

    // Add variables for highlighted code
    let highlightedHighLevelCode = '';
    let highlightedHtmlCode = '';
    let highlightedPugCode = '';

    function updateCode(event: any) {
        if (workspace?.isDragging()) {
            return;
        }

        try {
            // Generate HTML code
            const generatedCode = javascriptGenerator.workspaceToCode(workspace);
            code = generatedCode;
            
            // Generate high-level JSON code
            if (workspace) {
                highLevelCode = generateHighLevelCode(workspace);
            }
            
            // Mark pug as needing update since HTML has changed
            pugNeedsUpdate = true;
            
            // Apply syntax highlighting for the active tab
            applyHighlighting();
            
            // Add this: Dispatch event with both code formats
            console.log("WebBlocks generated code:", { 
                html: code.substring(0, 100) + "...", 
                highlevelCode: highLevelCode.substring(0, 100) + "..." 
            });
            
            dispatch('change', {
                code: code,
                html: code,
                highlevelCode: highLevelCode
            });
        } catch (error) {
            console.error('Error generating code:', error);
        }
    }

    function generateHighLevelCode(workspace: WorkspaceSvg) {
        const topBlocks = workspace.getTopBlocks(true);
        console.log("Top blocks:", topBlocks.map(b => b.type));
        
        const components = topBlocks
            .map(block => {
                console.log(`Processing block: ${block.type}`);
                console.log(`Has highLevel: ${!!javascriptGenerator.forBlock[block.type]?.highLevel}`);
                const result = javascriptGenerator.blockToHighLevel(block);
                console.log(`Result:`, result);
                return result;
            })
            .filter(component => component !== null);
        
        return JSON.stringify(components, null, 2);
    }

    export async function setCode(htmlCode: string) {
        if (!workspace) {
            console.error("Workspace not initialized when setCode was called");
            return;
        }
        
        console.log("setCode called, but parsing not implemented yet");
        console.log("HTML to be parsed:", htmlCode);
        
        // For now, we'll just clear the workspace
        workspace.clear();
        
        // In the future, we can add parsing functionality here
    }

    function initializeBlockly() {
        console.log("Initializing Web Components Blockly");
            
        try {
            // Register web component blocks
            Object.entries(webBlocks).forEach(([name, block]) => {
                Blockly.Blocks[name] = block;
            });

            // Register web component generators
            Object.entries(webGenerators).forEach(([name, generator]) => {
                // First assign the HTML generator function
                javascriptGenerator.forBlock[name] = generator.html;
                
                // Then attach the highLevel function as a property
                javascriptGenerator.forBlock[name].highLevel = generator.highLevel;
                
                // Verify the attachment
                console.log(`Generator ${name} highLevel attached:`, 
                    !!javascriptGenerator.forBlock[name].highLevel);
            });

            // Initialize workspace
            if (blocklyDiv) {
                workspace = Blockly.inject(blocklyDiv, {
                    toolbox,
                    theme: theme === 'default' ? undefined : theme,
                    readOnly,
                    scrollbars: true,
                    trashcan: true,
                    zoom: {
                        controls: true,
                        wheel: true,
                        startScale: 1.0,
                        maxScale: 3,
                        minScale: 0.3,
                        scaleSpeed: 1.2,
                        pinch: true
                    },
                    horizontalLayout: false,
                    toolboxPosition: 'start',
                    move: {
                        scrollbars: true,
                        drag: true,
                        wheel: true,
                    },
                    grid: {
                        spacing: 20,
                        length: 3,
                        colour: '#ccc',
                        snap: true
                    },
                    // Add collapse option for all blocks
                    collapse: true,
                });

                console.log("Web Blockly workspace initialized:", !!workspace);

                // Add change listener
                workspace.addChangeListener(updateCode);
                
                // Initialize code if provided
                if (code && code.trim() !== '') {
                    setCode(code);
                }

                // Dispatch the initialized event
                dispatch('initialized');
            } else {
                console.error("blocklyDiv is null, cannot initialize Blockly");
            }
        } catch (error) {
            console.error('Error initializing web blocks:', error);
        }
    }
    
    onMount(() => {
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            initializeBlockly();
        }, 100);
    });
    
    afterUpdate(() => {
        if (workspace) {
            workspace.resize();
        }
    });

    async function setActiveTab(tab: string) {
        activeTab = tab;
        
        // When switching to pug tab, generate pug code if needed
        if (tab === 'pug' && pugNeedsUpdate) {
            try {
                pugCode = await convertHTMLToPug(code);
                pugNeedsUpdate = false;
            } catch (error) {
                console.error('Error converting HTML to Pug:', error);
                pugCode = '// Error converting to Pug\n// See console for details';
            }
        }
        
        // When switching back to blocks tab, resize the workspace
        if (tab === 'blocks' && workspace) {
            const currentWorkspace = workspace;
            setTimeout(() => currentWorkspace.resize(), 10);
        }
        
        // Apply syntax highlighting for the newly selected tab
        applyHighlighting();
    }

    // Add function to load high-level code
    export async function loadFromHighLevelCode(jsonString: string) {
        if (!workspace) {
            console.error("Workspace not initialized when loadFromHighLevelCode was called");
            return;
        }
        
        try {
            // Use the parser to create blocks from JSON
            createBlocksFromJson(workspace, jsonString);
            
            // Update the code
            updateCode(null);
        } catch (error) {
            console.error("Error loading from high-level code:", error);
        }
    }
    
    // Function to create blocks from component data
    function createBlocksFromComponents(components: any[]) {
        if (!workspace || !components || !Array.isArray(components)) return;
        
        components.forEach(component => {
            createBlockFromComponent(component);
        });
    }
    
    // Function to create a single block from component data
    function createBlockFromComponent(component: any, parentBlock?: Blockly.Block, parentConnection?: Blockly.Connection) {
        if (!workspace || !component || !component.type) return null;
        
        console.log(`Creating block of type: ${component.type}`);
        
        // Map component type to block type - adding web_ prefix and handling special cases
        let blockType = `web_${component.type}`;
        
        // Handle special case mappings
        const typeMapping: Record<string, string> = {
            'navItem': 'web_nav_item',
            // Add more mappings as needed
        };
        
        if (typeMapping[component.type]) {
            blockType = typeMapping[component.type];
        }
        
        console.log(`Mapped to block type: ${blockType}`);
        
        try {
            // Create the block
            const block = workspace.newBlock(blockType);
            
            // Set block properties
            if (component.properties) {
                Object.entries(component.properties).forEach(([key, value]) => {
                    // Try different field name formats (camelCase, UPPERCASE, lowercase)
                    const possibleFieldNames = [
                        key.toUpperCase(),                             // LOGOTEXT
                        key,                                           // logoText
                        key.toLowerCase(),                             // logotext
                        key.charAt(0).toUpperCase() + key.slice(1)     // LogoText
                    ];
                    
                    let fieldSet = false;
                    
                    // Try each possible field name
                    for (const fieldName of possibleFieldNames) {
                        try {
                            if (typeof value === 'boolean') {
                                block.setFieldValue(value ? 'TRUE' : 'FALSE', fieldName);
                            } else {
                                block.setFieldValue(String(value), fieldName);
                            }
                            console.log(`Successfully set field ${fieldName} = ${value}`);
                            fieldSet = true;
                            break;
                        } catch (e) {
                            // Continue trying other field name formats
                        }
                    }
                    
                    if (!fieldSet) {
                        console.warn(`Could not set any field for property "${key}" with value "${value}" on block ${blockType}`);
                    }
                });
            }
            
            // Connect to parent if provided
            if (parentBlock && parentConnection) {
                const childConnection = block.previousConnection || block.outputConnection;
                if (childConnection && parentConnection) {
                    try {
                        parentConnection.connect(childConnection);
                    } catch (e: any) {
                        console.warn(`Could not connect blocks: ${e.message}`);
                    }
                }
            } else {
                // Only initialize if it's a top-level block
                block.initSvg();
                block.render();
            }
            
            // Process children
            if (component.children && Array.isArray(component.children)) {
                // Find the connection for statement inputs
                let statementInput: Blockly.Input | null = null;
                
                // Try common statement input names
                const possibleInputs = ['LINKS', 'FEATURES', 'ITEMS', 'CHILDREN'];
                for (const inputName of possibleInputs) {
                    const input = block.getInput(inputName);
                    if (input && input.connection) {
                        statementInput = input;
                        break;
                    }
                }
                
                if (statementInput && statementInput.connection) {
                    let previousChildBlock: Blockly.Block | null = null;
                    
                    component.children.forEach((childComponent: any) => {
                        const connection = previousChildBlock ? 
                            (previousChildBlock.nextConnection || undefined) : 
                            (statementInput!.connection || undefined);

                        const childBlock = createBlockFromComponent(
                            childComponent, 
                            previousChildBlock ? undefined : block,
                            connection
                        );
                        
                        if (childBlock) {
                            previousChildBlock = childBlock;
                        }
                    });
                } else {
                    console.warn(`No statement input found for block ${blockType} children`);
                }
            }
            
            return block;
        } catch (error) {
            console.error(`Error creating block of type ${blockType}:`, error);
            return null;
        }
    }

    // Update your functions with separate HTML and Pug cleaners
    function cleanCode(code: string, isRaw: boolean, includeComments: boolean): string {
        // Regular HTML cleaning
        return cleanHTMLCode(code, isRaw, includeComments);
    }

    function cleanHTMLCode(code: string, isRaw: boolean, includeComments: boolean): string {
        let result = code;
        
        // Remove only actual HTML comments, not script tags or URLs
        if (!includeComments) {
            // Proper HTML comment pattern
            result = result.replace(/<!--[\s\S]*?-->/g, '');
            // Remove JS/CSS comments (single-line)
            result = result.replace(/(?<!:)\/\/.*$/gm, '');
            // Remove JS/CSS comments (multi-line)
            result = result.replace(/\/\*[\s\S]*?\*\//g, '');
        }
        
        // Remove Bootstrap-specific attributes if raw mode
        if (isRaw) {
            // Remove class attributes
            result = result.replace(/\sclass="[^"]*"/g, '');
            
            // Remove Bootstrap data attributes
            result = result.replace(/\sdata-bs-[a-zA-Z0-9-]+="[^"]*"/g, '');
            
            // Remove common Bootstrap aria attributes
            result = result.replace(/\saria-[a-zA-Z0-9-]+="[^"]*"/g, '');
            
            // Remove role attributes
            result = result.replace(/\srole="[^"]*"/g, '');
        }
        
        return result;
    }

    function cleanPugCode(code: string, isRaw: boolean, includeComments: boolean): string {
        let result = code;
        
        // Handle Pug comments with their indented content
        if (!includeComments) {
            // Split into lines for handling indentation-based content
            const lines = result.split('\n');
            const cleanedLines = [];
            let skippingComment = false;
            let commentIndent = 0;
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const leadingSpacesMatch = line.match(/^\s*/);
                const leadingSpaces = leadingSpacesMatch ? leadingSpacesMatch[0].length : 0;
                
                if (line.trim().startsWith('//')) {
                    // Start of a comment block
                    skippingComment = true;
                    commentIndent = leadingSpaces;
                } else if (skippingComment) {
                    // Continue skipping if this line is indented more than the comment line
                    if (leadingSpaces <= commentIndent) {
                        skippingComment = false;
                    }
                }
                
                if (!skippingComment) {
                    cleanedLines.push(line);
                }
            }
            
            result = cleanedLines.join('\n');
        }
        
        // Handle Pug class syntax for raw mode
        if (isRaw) {
            // Remove Bootstrap classes from Pug class syntax
            // Match tag.class1.class2 patterns
            result = result.replace(/([a-zA-Z0-9-]+)((?:\.[a-zA-Z0-9_-]+)+)/g, (match, tag, classes) => {
                if (isBootstrapClass(classes)) {
                    return tag; // Just return the tag without any classes
                }
                return match; // Keep non-Bootstrap classes
            });
            
            // Remove Bootstrap data attributes
            result = result.replace(/data-bs-[a-zA-Z0-9-]+="[^"]*"/g, '');
            
            // Remove aria attributes
            result = result.replace(/aria-[a-zA-Z0-9-]+="[^"]*"/g, '');
            
            // Remove role attributes
            result = result.replace(/role="[^"]*"/g, '');
        }
        
        return result;
    }

    // Helper to check if a class string contains Bootstrap classes
    function isBootstrapClass(classString: string) {
        const bootstrapPrefixes = [
            '.navbar', '.nav', '.container', '.row', '.col', '.btn', '.card', 
            '.carousel', '.dropdown', '.form', '.input', '.jumbotron', '.alert',
            '.badge', '.bg-', '.text-', '.d-', '.mb-', '.mt-', '.ms-', '.me-',
            '.p-', '.m-', '.fs-', '.fw-', '.border'
        ];
        
        return bootstrapPrefixes.some(prefix => classString.includes(prefix));
    }

    // Function to apply syntax highlighting
    function applyHighlighting() {
        // Highlight JSON
        if (activeTab === 'highlevel') {
            highlightedHighLevelCode = Prism.highlight(
                highLevelCode, 
                Prism.languages.json, 
                'json'
            );
        }
        
        // Highlight HTML
        if (activeTab === 'code') {
            const cleanedHtml = cleanHTMLCode(code, showRawCode, showComments);
            highlightedHtmlCode = Prism.highlight(
                cleanedHtml, 
                Prism.languages.markup, 
                'html'
            );
        }
        
        // Highlight Pug
        if (activeTab === 'pug' && !pugNeedsUpdate) {
            const cleanedPug = cleanPugCode(pugCode, showRawCode, showComments);
            highlightedPugCode = Prism.highlight(
                cleanedPug, 
                Prism.languages.pug, 
                'pug'
            );
        }
    }

    // Watch for changes to showRawCode and showComments
    $: if (showRawCode !== undefined || showComments !== undefined) {
        applyHighlighting();
    }
</script>

{#if showTabs}
<div class="web-blocks-tabs">
    <button 
        class="tab-button {activeTab === 'blocks' ? 'active' : ''}" 
        on:click={() => setActiveTab('blocks')}>
        Blocks
    </button>
    <button 
        class="tab-button {activeTab === 'highlevel' ? 'active' : ''}" 
        on:click={() => setActiveTab('highlevel')}>
        Structured Code (JSON)
    </button>
    <button 
        class="tab-button {activeTab === 'code' ? 'active' : ''}" 
        on:click={() => setActiveTab('code')}>
        HTML
    </button>
    <button 
        class="tab-button {activeTab === 'pug' ? 'active' : ''}" 
        on:click={() => setActiveTab('pug')}>
        Pug
    </button>
</div>
{/if}

<div class="web-blocks-content">
    <div class="web-blocks-container" 
         bind:this={containerEl} 
         style="display: {activeTab === 'blocks' ? 'block' : 'none'}">
        <div bind:this={blocklyDiv} class="web-blocks-workspace"></div>
    </div>
    
    {#if activeTab === 'highlevel'}
        <div class="code-container">
            <pre class="code-display"><code class="language-json">{@html highlightedHighLevelCode || highLevelCode}</code></pre>
        </div>
    {:else if activeTab === 'code'}
        <div class="code-container">
            <div class="code-options">
                <label>
                    <input type="checkbox" bind:checked={showRawCode}>
                    Raw HTML
                </label>
                <label>
                    <input type="checkbox" bind:checked={showComments}>
                    Show Comments
                </label>
            </div>
            <pre class="code-display"><code class="language-html">{@html highlightedHtmlCode || cleanHTMLCode(code, showRawCode, showComments)}</code></pre>
        </div>
    {:else if activeTab === 'pug'}
        <div class="code-container">
            <div class="code-options">
                <label>
                    <input type="checkbox" bind:checked={showRawCode}>
                    Raw HTML
                </label>
                <label>
                    <input type="checkbox" bind:checked={showComments}>
                    Show Comments
                </label>
            </div>
            <pre class="code-display"><code class="language-pug">{@html highlightedPugCode || cleanPugCode(pugCode, showRawCode, showComments)}</code></pre>
        </div>
    {/if}
</div>

<style>
    .web-blocks-container {
        width: 100%;
        height: 100%;
        min-height: 400px;
        position: relative;
        display: block;
        border: 1px solid #aaaaaa;
    }

    .web-blocks-workspace {
        width: 100%;
        height: 100%;
        min-height: 400px;
        position: absolute;
        top: 0;
        left: 0;
    }
    
    .web-blocks-tabs {
        display: flex;
        border-bottom: 1px solid #ddd;
        margin-bottom: 0;
    }
    
    .tab-button {
        padding: 8px 16px;
        border: none;
        background: #f5f5f5;
        cursor: pointer;
        margin-right: 2px;
        border-radius: 3px 3px 0 0;
        border: 1px solid #ddd;
        border-bottom: none;
    }
    
    .tab-button.active {
        background: white;
        border-bottom: 2px solid white;
        margin-bottom: -1px;
        font-weight: bold;
    }
    
    .code-container {
        width: 100%;
        height: 100%;
        min-height: 400px;
        overflow: auto;
        border: 1px solid #aaaaaa;
        padding: 10px;
        box-sizing: border-box;
    }
    
    .code-display {
        margin: 0;
        white-space: pre-wrap;
        font-family: monospace;
        font-size: 14px;
    }
    
    .web-blocks-content {
        position: relative;
        height: 100%;
    }

    /* Add styles for the syntax highlighting */
    .code-display code {
        font-family: monospace;
        font-size: 14px;
        background: transparent;
        padding: 0;
        white-space: pre-wrap;
    }
    
    :global(.token.tag) {
        color: #2f6f9f;
    }
    
    :global(.token.attr-name) {
        color: #4f9fcf;
    }
    
    :global(.token.attr-value) {
        color: #d44950;
    }
    
    :global(.token.string) {
        color: #690;
    }
    
    :global(.token.property) {
        color: #905;
    }
    
    :global(.token.number) {
        color: #905;
    }
    
    :global(.token.comment) {
        color: #999;
        font-style: italic;
    }
</style> 
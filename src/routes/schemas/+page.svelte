<script lang="ts">
    import { onMount } from 'svelte';
    import { initializeBlocks } from '$lib/components/blocks/index.js';
    import type { BlockConfig, BlockInputConfig } from '$lib/types.js';
    
    let schemas: Record<string, any> = {};
    let isReady = false;
    let error: string | null = null;
    
    onMount(async () => {
      try {
        // Initialize blocks to get schemas
        const result = await initializeBlocks();
        
        if (!result || !result.definitions) {
          throw new Error('Block definitions not found');
        }
        
        const { definitions: blockDefinitions } = result;
        
        // Extract schemas directly from block definitions
        schemas = Object.fromEntries(
          Object.entries(blockDefinitions)
            .map(([key, definition]) => {
              // Remove "web_" prefix from the key
              const cleanKey = key.replace(/^web_/, '');
              
              // Use the schema if it exists, or fall back to generating one
              const schema = definition.schema || definition.blockConfig?.schema;
              
              if (schema) {
                // Clone the schema and update the title if needed
                const cleanSchema = {...schema};
                if (cleanSchema.title && cleanSchema.title === key) {
                  cleanSchema.title = cleanKey;
                }
                return [cleanKey, cleanSchema] as [string, any];
              }
              
              // Try to find a corresponding block config
              const blockConfig = definition.blockConfig as BlockConfig;
              
              let generatedSchema: {
                type: string;
                title: string;
                description: string;
                properties: Record<string, any>;
                required?: string[];
                [key: string]: any;
              } = {
                type: "object",
                title: cleanKey, // Use clean key for title
                description: blockConfig?.tooltip || definition.tooltip || `Schema for ${cleanKey}`,
                properties: {},
                required: []
              };
              
              // If we have a block config with inputs, use it to generate a detailed schema
              if (blockConfig?.inputs) {
                generatedSchema.properties = blockConfig.inputs.reduce((props: Record<string, any>, input: BlockInputConfig) => {
                  const inputName = input.name || input.type;
                  props[inputName] = {
                    type: mapInputTypeToJsonType(input.type),
                    description: input.label || input.text || `${input.type} input`,
                  };
                  
                  // Add additional properties based on input type
                  if (input.default !== undefined) props[inputName].default = input.default;
                  if (input.min !== undefined) props[inputName].minimum = input.min;
                  if (input.max !== undefined) props[inputName].maximum = input.max;
                  if (input.precision !== undefined) props[inputName].multipleOf = 1/Math.pow(10, input.precision);
                  
                  // Handle options (enum values)
                  if (input.options) {
                    if (Array.isArray(input.options)) {
                      props[inputName].enum = input.options.map(opt => 
                        Array.isArray(opt) ? opt[0] : opt
                      );
                    } else if (typeof input.options === 'string') {
                      props[inputName].enum = [input.options];
                    }
                  }
                  
                  return props;
                }, {});
                
                // Add required fields
                generatedSchema.required = blockConfig.inputs
                  .filter(input => input.default === undefined && !input.name?.startsWith('optional_'))
                  .map(input => input.name || input.type);
                  
                if (generatedSchema.required.length === 0) {
                  delete generatedSchema.required;
                }
              }
              
              // Add connection information if available
              if (blockConfig?.connections) {
                generatedSchema.connections = blockConfig.connections;
              }
              
              return [cleanKey, generatedSchema] as [string, any];
            })
            .filter((entry): entry is [string, any] => entry[1] !== undefined)
        );
        
        isReady = true;
      } catch (err) {
        error = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('Error extracting schemas:', err);
      }
    });
    
    function downloadSchemas() {
      const jsonContent = JSON.stringify(schemas, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'block-schemas.json';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
    }
    
    // Helper function to map Blockly input types to JSON schema types
    function mapInputTypeToJsonType(inputType: string): string {
      switch (inputType.toLowerCase()) {
        case 'number':
        case 'angle':
          return 'number';
        case 'boolean':
        case 'checkbox':
          return 'boolean';
        case 'array':
          return 'array';
        case 'object':
          return 'object';
        default:
          return 'string';
      }
    }
  </script>
  
  <div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-6">Block Schemas Extractor</h1>
    
    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        <p><strong>Error:</strong> {error}</p>
        <p class="mt-2">Check the console for more details.</p>
      </div>
    {/if}
    
    {#if isReady}
      <div class="mb-6">
        <p class="mb-4">Found {Object.keys(schemas).length} block schemas.</p>
        <button 
          on:click={downloadSchemas}
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Download Schemas JSON
        </button>
      </div>
      
      <div class="mt-8">
        <h2 class="text-xl font-semibold mb-4">Preview:</h2>
        <pre class="bg-gray-100 p-4 rounded overflow-auto max-h-96">{JSON.stringify(schemas, null, 2)}</pre>
      </div>
    {:else if !error}
      <div class="flex items-center justify-center h-32">
        <p>Loading schemas...</p>
      </div>
    {/if}
  </div>
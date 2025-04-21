import type { WorkspaceSvg } from 'blockly';
import type { ComponentNode } from '$lib/types.js';

// Configuration for component parsers
export interface ParserConfig {
  // Block type in Blockly
  blockType: string;
  
  // Property mappings from component to block
  propertyMappings: {
    // Component property name
    componentProp: string;
    // Block field name (default: componentProp.toUpperCase())
    blockField?: string;
    // Transform function for the value
    transform?: (value: any) => any;
  }[];
  
  // Input name for children in this block
  childrenInput?: string;
}

/**
 * Creates a component parser from configuration
 */
export function createComponentParser(config: ParserConfig) {
  return {
    /**
     * Create a block from a component node
     */
    createBlock: function(
      workspace: WorkspaceSvg,
      component: ComponentNode,
      parentBlock?: any,
      connectionName?: string
    ): any {
      // Skip if not the correct component type
      if (!this.canHandle(component)) return null;
      
      console.log(`Creating ${config.blockType} block from component:`, component);
      
      try {
        // Create the block
        const block = workspace.newBlock(config.blockType);
        
        // Set properties from the component
        if (component.properties) {
          // Map component properties to block fields
          config.propertyMappings.forEach(mapping => {
            const propValue = component.properties?.[mapping.componentProp];
            if (propValue !== undefined) {
              const blockField = mapping.blockField || mapping.componentProp.toUpperCase();
              let value = propValue;
              
              // Apply transformer if provided
              if (mapping.transform) {
                value = mapping.transform(value);
              }
              
              // Convert to string based on type
              const stringValue = typeof value === 'boolean' 
                ? (value ? 'TRUE' : 'FALSE') 
                : typeof value === 'object'
                  ? JSON.stringify(value, null, 2)
                  : String(value);
              
              try {
                block.setFieldValue(stringValue, blockField);
              } catch (e) {
                console.warn(`Failed to set field ${blockField}:`, e);
              }
            }
          });
        }
        
        // Initialize the block SVG
        block.initSvg();
        
        // Position the block if it's a top-level block
        if (!parentBlock) {
          block.moveBy(20, 20);
          block.render();
        } else if (connectionName) {
          // Connect to parent
          try {
            if (connectionName === 'NEXT') {
              if (parentBlock.nextConnection && block.previousConnection) {
                parentBlock.nextConnection.connect(block.previousConnection);
              }
            } else {
              const parentInput = parentBlock.getInput(connectionName);
              if (parentInput?.connection && block.previousConnection) {
                parentInput.connection.connect(block.previousConnection);
              }
            }
          } catch (e) {
            console.warn(`Failed to connect block to parent:`, e);
          }
        }
        
        return block;
      } catch (error) {
        console.error(`Error creating ${config.blockType} block:`, error);
        return null;
      }
    },
    
    /**
     * Process children for a block
     */
    processChildren: function(
      workspace: WorkspaceSvg,
      parentBlock: any,
      children: ComponentNode[]
    ): void {
      if (!children || !children.length) return;
      
      console.log(`Processing children for ${config.blockType} block:`, children);
      
      // Find the content input for children
      const contentInput = config.childrenInput || 'CONTENT';
      let previousBlock: any = null;
      
      // This relies on the main parser's createComponentBlock function
      const mainParser = (window as any).__blocklyParser || {
        createComponentBlock: () => null
      };
      
      children.forEach(childComponent => {
        const childBlock = mainParser.createComponentBlock(
          workspace,
          childComponent,
          previousBlock || parentBlock,
          previousBlock ? 'NEXT' : contentInput
        );
        
        if (childBlock) {
          previousBlock = childBlock;
        }
      });
      
      // Render the parent block after processing children
      parentBlock.render();
    },
    
    /**
     * Check if this parser can handle the component
     */
    canHandle: function(component: ComponentNode): boolean {
      return component.type === config.blockType.replace('web_', '');
    }
  };
} 
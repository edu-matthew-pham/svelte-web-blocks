import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

// Types for generator configuration
export interface GeneratorConfig {
  // Property mappings from block field names to component properties
  propertyMappings: {
    // The property name in the component model
    componentProp: string;
    // The field name in the block (default: componentProp.toUpperCase())
    blockField?: string;
    // Optional transformer for the value
    transform?: (value: any) => any;
  }[];
  
  // Child input configurations
  childInputs?: {
    // Name of the input in the block
    inputName: string;
    // Optional property name in children array (for named child collections)
    childrenProp?: string;
  }[];
  
  // Custom HTML generator function
  htmlRenderer?: (props: Record<string, any>, childrenHtml: Record<string, string>) => string;
}

/**
 * Creates generator functions for HTML and high-level code from a configuration
 */
export function createGenerator(config: GeneratorConfig) {
  return {
    html: function(block: Blockly.Block): string {
      // Extract all properties based on mappings
      const props: Record<string, any> = {};
      
      config.propertyMappings.forEach(mapping => {
        const blockField = mapping.blockField || mapping.componentProp.toUpperCase();
        let value = block.getFieldValue(blockField);
        
        // Apply transformer if provided
        if (mapping.transform) {
          value = mapping.transform(value);
        }
        
        props[mapping.componentProp] = value;
      });
      
      // Get all children from configured inputs
      const childrenHtml: Record<string, string> = {};
      (config.childInputs || []).forEach(input => {
        const childHtml = javascriptGenerator.statementToCode(block, input.inputName);
        if (input.childrenProp) {
          childrenHtml[input.childrenProp] = childHtml;
        } else {
          childrenHtml[input.inputName.toLowerCase()] = childHtml;
        }
      });
      
      // Use custom renderer if provided
      if (config.htmlRenderer) {
        return config.htmlRenderer(props, childrenHtml);
      }
      
      // Default rendering just concatenates children
      return Object.values(childrenHtml).join('\n');
    },
    
    highLevel: function(block: Blockly.Block): any {
      // Extract all properties based on mappings
      const props: Record<string, any> = {};
      
      config.propertyMappings.forEach(mapping => {
        const blockField = mapping.blockField || mapping.componentProp.toUpperCase();
        let value = block.getFieldValue(blockField);
        
        // Apply transformer if provided
        if (mapping.transform) {
          value = mapping.transform(value);
        }
        
        props[mapping.componentProp] = value;
      });
      
      // Process children
      const children: any[] = [];
      (config.childInputs || []).forEach(input => {
        let contentBlock = block.getInputTargetBlock(input.inputName);
        while (contentBlock) {
          const content = javascriptGenerator.blockToHighLevel(contentBlock);
          if (content) children.push(content);
          contentBlock = contentBlock.getNextBlock();
        }
      });
      
      // Determine block type from the block's type
      const type = block.type.replace('web_', '');
      
      return {
        type,
        properties: props,
        children: children.length > 0 ? children : undefined
      };
    }
  };
} 
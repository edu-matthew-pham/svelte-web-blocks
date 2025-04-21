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
  
  // Script input configurations (similar to childInputs but for script-type blocks)
  scriptInputs?: {
    // Name of the input in the block
    inputName: string;
  }[];
  
  // Custom HTML generator function
  htmlRenderer?: (props: Record<string, any>, childrenHtml: Record<string, string>) => string;
  
  // Custom JavaScript generator function
  jsRenderer?: (props: Record<string, any>, childrenJs: Record<string, string>) => string;
}

/**
 * Creates generator functions for HTML, JavaScript and high-level code from a configuration
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
      
      // Process children
      const childrenHtml: Record<string, string> = {};
      
      (config.childInputs || []).forEach(input => {
        const childHtml = javascriptGenerator.statementToCode(block, input.inputName);
        if (input.childrenProp) {
          childrenHtml[input.childrenProp] = childHtml;
        } else {
          childrenHtml[input.inputName.toLowerCase()] = childHtml;
        }
      });
      
      // Process scripts
      if (config.scriptInputs && config.scriptInputs.length > 0) {
        let scriptsCode = '';
        config.scriptInputs.forEach(input => {
          scriptsCode += javascriptGenerator.statementToCode(block, input.inputName);
        });
        childrenHtml['scripts'] = scriptsCode;
      }
      
      // Use custom renderer if provided
      if (config.htmlRenderer) {
        return config.htmlRenderer(props, childrenHtml);
      }
      
      // Default rendering just concatenates children
      return Object.values(childrenHtml).join('\n');
    },
    
    js: function(block: Blockly.Block): string {
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
      const childrenJs: Record<string, string> = {};
      (config.childInputs || []).forEach(input => {
        const childJs = javascriptGenerator.statementToCode(block, input.inputName);
        if (input.childrenProp) {
          childrenJs[input.childrenProp] = childJs;
        } else {
          childrenJs[input.inputName.toLowerCase()] = childJs;
        }
      });
      
      // Use custom JS renderer if provided
      if (config.jsRenderer) {
        return config.jsRenderer(props, childrenJs);
      }
      
      // Default rendering just concatenates children with appropriate JS syntax
      return Object.values(childrenJs).join('\n');
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
      
      // Process regular children
      const children: any[] = [];
      (config.childInputs || []).forEach(input => {
        let contentBlock = block.getInputTargetBlock(input.inputName);
        while (contentBlock) {
          const content = javascriptGenerator.blockToHighLevel(contentBlock);
          if (content) children.push(content);
          contentBlock = contentBlock.getNextBlock();
        }
      });
      
      // Process script children if configured
      const scripts: any[] = [];
      (config.scriptInputs || []).forEach(input => {
        let scriptBlock = block.getInputTargetBlock(input.inputName);
        while (scriptBlock) {
          const script = javascriptGenerator.blockToHighLevel(scriptBlock);
          if (script) scripts.push(script);
          scriptBlock = scriptBlock.getNextBlock();
        }
      });
      
      // Determine block type from the block's type
      const type = block.type.replace('web_', '');
      
      return {
        type,
        properties: props,
        children: children.length > 0 ? children : undefined,
        scripts: scripts.length > 0 ? scripts : undefined
      };
    }
  };
} 
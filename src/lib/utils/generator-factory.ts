import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

// Component ID counters to track usage
const componentCounters: Record<string, number> = {};

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
  
  // Style input configurations for CSS style blocks
  styleInputs?: {
    // Name of the input in the block
    inputName: string;
  }[];
  
  // Custom HTML generator function
  htmlRenderer?: (props: Record<string, any>, childrenHtml: Record<string, string>, attributes: ComponentAttributes) => string;
  
  // Custom JavaScript generator function
  jsRenderer?: (props: Record<string, any>, childrenJs: Record<string, string>, attributes: ComponentAttributes) => string;
  
  // OnLoad script input 
  onloadInput?: string; // Name of the onload input in the block
}

// Add type for component attributes
export interface ComponentAttributes {
  id?: string;
  className?: string;
  dataAttributes?: string;
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
      
      // Auto-generate ID for this block if not provided
      const currentBlockId = ensureBlockHasId(block);
      
      // Process children
      const childrenHtml: Record<string, string> = {};
      
      (config.childInputs || []).forEach(input => {
        // For statement inputs, process each child block
        if (block.getInputTargetBlock(input.inputName)) {
          // Get the first block in the statement
          let childBlock = block.getInputTargetBlock(input.inputName);
          
          // Process each block in the chain
          while (childBlock) {
            // Auto-generate ID for child blocks
            ensureBlockHasId(childBlock);
            
            // Move to next block in the chain
            childBlock = childBlock.getNextBlock();
          }
        }
        
        // Get the generated HTML from the Javascript generator 
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
          // Get the generated JavaScript from the generator
          const scriptCode = javascriptGenerator.statementToCode(block, input.inputName);
          if (scriptCode) {
            scriptsCode += scriptCode + '\n';
          }
        });
        
        childrenHtml['scripts'] = scriptsCode;
      }
      
      // Process styles
      if (config.styleInputs && config.styleInputs.length > 0) {
        let stylesCode = '';
        
        config.styleInputs.forEach(input => {
          // Get the generated CSS from the generator
          const styleCode = javascriptGenerator.statementToCode(block, input.inputName);
          if (styleCode) {
            stylesCode += styleCode + '\n';
          }
        });
        
        childrenHtml['styles'] = stylesCode;
      }
      
      // Process onload script if configured
      if (config.onloadInput) {
        const onloadCode = javascriptGenerator.statementToCode(block, config.onloadInput);
        if (onloadCode) {
          childrenHtml['onloadScripts'] = onloadCode;
        }
      }
      
      // Extract standard attributes (ID, Class, Data Attributes)
      const attributes: ComponentAttributes = {};
      
      // Extract class and data attributes as provided
      if (block.getField('CLASS')) {
        attributes.className = block.getFieldValue('CLASS');
      }
      if (block.getField('DATA_ATTRIBUTES')) {
        attributes.dataAttributes = block.getFieldValue('DATA_ATTRIBUTES');
      }
      
      // Use the already generated/retrieved ID
      attributes.id = currentBlockId;
      
      // Use custom renderer if provided
      if (config.htmlRenderer) {
        return config.htmlRenderer(props, childrenHtml, attributes);
      }
      
      // Default rendering just concatenates children, not applying attributes
      // (Attributes are expected to be handled by the custom renderer)
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
      
      // Auto-generate ID for this block if not provided
      const currentBlockId = ensureBlockHasId(block);
      
      // Get all children from configured inputs
      const childrenJs: Record<string, string> = {};
      (config.childInputs || []).forEach(input => {
        // Auto-generate IDs for children
        if (block.getInputTargetBlock(input.inputName)) {
          let childBlock = block.getInputTargetBlock(input.inputName);
          while (childBlock) {
            ensureBlockHasId(childBlock);
            childBlock = childBlock.getNextBlock();
          }
        }
        
        const childJs = javascriptGenerator.statementToCode(block, input.inputName);
        if (input.childrenProp) {
          childrenJs[input.childrenProp] = childJs;
        } else {
          childrenJs[input.inputName.toLowerCase()] = childJs;
        }
      });
      
      // Extract standard attributes (ID, Class, Data Attributes)
      const attributes: ComponentAttributes = {};
      
      // Extract class and data attributes as provided
      if (block.getField('CLASS')) {
        attributes.className = block.getFieldValue('CLASS');
      }
      if (block.getField('DATA_ATTRIBUTES')) {
        attributes.dataAttributes = block.getFieldValue('DATA_ATTRIBUTES');
      }
      
      // Use the already generated ID
      attributes.id = currentBlockId;
      
      // Use custom JS renderer if provided
      if (config.jsRenderer) {
        return config.jsRenderer(props, childrenJs, attributes);
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
      
      // Auto-generate ID for this block if not provided
      const currentBlockId = ensureBlockHasId(block);
      
      // Process regular children
      const children: any[] = [];
      (config.childInputs || []).forEach(input => {
        let contentBlock = block.getInputTargetBlock(input.inputName);
        while (contentBlock) {
          // Ensure child has ID
          ensureBlockHasId(contentBlock);
          
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
      
      // Process style children if configured
      const styles: any[] = [];
      (config.styleInputs || []).forEach(input => {
        let styleBlock = block.getInputTargetBlock(input.inputName);
        while (styleBlock) {
          const style = javascriptGenerator.blockToHighLevel(styleBlock);
          if (style) styles.push(style);
          styleBlock = styleBlock.getNextBlock();
        }
      });
      
      // Process onload script if configured
      const onloadScripts: any[] = [];
      if (config.onloadInput) {
        let onloadBlock = block.getInputTargetBlock(config.onloadInput);
        while (onloadBlock) {
          const script = javascriptGenerator.blockToHighLevel(onloadBlock);
          if (script) onloadScripts.push(script);
          onloadBlock = onloadBlock.getNextBlock();
        }
      }
      
      // Determine block type from the block's type
      const type = block.type.replace('web_', '');
      
      // Extract standard attributes
      const attributes: ComponentAttributes = {};
      
      // Extract class and data attributes as provided
      if (block.getField('CLASS')) {
        attributes.className = block.getFieldValue('CLASS');
      }
      if (block.getField('DATA_ATTRIBUTES')) {
        attributes.dataAttributes = block.getFieldValue('DATA_ATTRIBUTES');
      }
      
      // Use the already generated ID
      attributes.id = currentBlockId;
      
      return {
        type,
        properties: props,
        children: children.length > 0 ? children : undefined,
        scripts: scripts.length > 0 ? scripts : undefined,
        styles: styles.length > 0 ? styles : undefined,
        onloadScripts: onloadScripts.length > 0 ? onloadScripts : undefined,
        attributes: attributes
      };
    }
  };
}

/**
 * Ensures a block has an ID, auto-generating one if needed.
 * Returns the ID (either existing or newly generated).
 */
function ensureBlockHasId(block: Blockly.Block): string {
  // Check if block has an ID field
  if (!block.getField('ID')) {
    return ''; // No ID field, nothing to do
  }
  
  // Get current ID value
  const providedId = block.getFieldValue('ID');
  
  // If ID already exists and is not empty, use it
  if (providedId && providedId.trim() !== '') {
    return providedId;
  }
  
  // Auto-generate an ID based on component type
  const componentType = block.type.replace('web_', '');
  
  // Initialize counter if not exists
  if (!componentCounters[componentType]) {
    componentCounters[componentType] = 1;
  } else {
    componentCounters[componentType]++;
  }
  
  // Create the ID
  const generatedId = `${componentType}-${componentCounters[componentType]}`;
  
  // Update the block field with the generated ID
  if (!(block as any)._autoIdGenerated) {
    (block as any)._autoIdGenerated = true;
    block.setFieldValue(generatedId, 'ID');
  }
  
  return generatedId;
} 
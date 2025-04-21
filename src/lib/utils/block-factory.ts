import * as Blockly from 'blockly';
// Import multiline input from plugin package
import * as MultilineInput from '@blockly/field-multilineinput';

// Access the field class directly
const FieldMultilineInput = MultilineInput.FieldMultilineInput || MultilineInput;

/**
 * Input field configuration
 */
type FieldConfig = 
  | { type: 'label'; text: string }
  | { type: 'text'; name: string; default: string }
  | { type: 'dropdown'; name: string; options: [string, string][] }
  | { type: 'checkbox'; name: string; default?: boolean }
  | { type: 'number'; name: string; default?: number; min?: number; max?: number }
  | { type: 'multiline'; name: string; default?: string }
  // Add other field types as needed

/**
 * Input configuration
 */
type InputConfig = {
  type: 'dummy' | 'value' | 'statement';
  name?: string;
  check?: string | string[];
  fields: FieldConfig[];
  align?: 'LEFT' | 'RIGHT' | 'CENTER';
}

/**
 * Block definition configuration
 */
type BlockConfig = {
  color: number;
  tooltip: string;
  helpUrl?: string;
  inputs: InputConfig[];
  connections?: {
    previous?: boolean;
    next?: boolean;
  };
  extensions?: string[];
  mutator?: string;
  outputType?: string | string[];
}

/**
 * Creates a block definition function from a configuration object
 */
export function createBlockDefinition(config: BlockConfig): {
  init: (this: Blockly.Block) => void;
} {
  return {
    init: function(this: Blockly.Block) {
      this.setColour(config.color);
      this.setTooltip(config.tooltip);
      if (config.helpUrl) this.setHelpUrl(config.helpUrl);
      
      // Add inputs
      config.inputs.forEach(input => {
        let inputLine: Blockly.Input;
        
        if (input.type === 'dummy') {
          inputLine = this.appendDummyInput();
        } else if (input.type === 'value') {
          inputLine = this.appendValueInput(input.name!);
          if (input.check) inputLine.setCheck(input.check);
        } else if (input.type === 'statement') {
          inputLine = this.appendStatementInput(input.name!);
          if (input.check) inputLine.setCheck(input.check);
        } else {
          // TypeScript needs all paths to assign a value
          throw new Error(`Unknown input type: ${input.type}`);
        }
        
        if (input.align) {
          const alignmentMap = {
            'LEFT': 1,
            'RIGHT': 3,
            'CENTER': 2
          };
          inputLine.setAlign(alignmentMap[input.align]);
        }
        
        // Add fields to the input
        input.fields.forEach(field => {
          if (field.type === 'label') {
            inputLine.appendField(field.text);
          } else if (field.type === 'text') {
            inputLine.appendField(new Blockly.FieldTextInput(field.default), field.name);
          } else if (field.type === 'dropdown') {
            inputLine.appendField(new Blockly.FieldDropdown(field.options), field.name);
          } else if (field.type === 'checkbox') {
            inputLine.appendField(new Blockly.FieldCheckbox(field.default ? 'TRUE' : 'FALSE'), field.name);
          } else if (field.type === 'number') {
            inputLine.appendField(new Blockly.FieldNumber(field.default ?? 0, field.min, field.max), field.name);
          } else if (field.type === 'multiline') {
            inputLine.appendField(new FieldMultilineInput(field.default || ''), field.name);
          }
          // Add other field types as needed
        });
      });
      
      // Set connections
      if (config.connections) {
        if (config.connections.previous !== undefined) {
          this.setPreviousStatement(config.connections.previous);
        }
        if (config.connections.next !== undefined) {
          this.setNextStatement(config.connections.next);
        }
      }
      
      // Set output type if specified
      if (config.outputType) {
        this.setOutput(true, config.outputType);
      }
      
      // Add extensions
      if (config.extensions) {
        for (const ext of config.extensions) {
          Blockly.Extensions.apply(ext, this, false);
        }
      }
      
      // Set mutator
      if (config.mutator) {
        Blockly.Extensions.apply(config.mutator, this, false);
      }
    }
  };
} 
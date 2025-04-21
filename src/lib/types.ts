import type * as Blockly from 'blockly';

export interface WebBlockDefinitions {
  [key: string]: {
    init: () => void;
    [key: string]: any;
  };
}

export interface BlockInputConfig {
  type: string;
  name?: string;
  text?: string;
  default?: string;
  checked?: boolean;
  options?: [string, string][] | string;
  check?: string;
  label?: string;
  children?: BlockInputConfig[];
  min?: number;
  max?: number;
  precision?: number;
}

export type BlockCategory = "component" | "item" | "document" | "javascript" | "reactive" | "dataObjects" | "expressions" | "lists" | "logic" | "loops";

export interface BlockConfig {
  type: string;
  category: BlockCategory;
  color: number;
  tooltip: string;
  helpUrl: string;
  inputs: BlockInputConfig[];
  connections: {
    previous: string | false;
    next: string | false;
    output?: string;
  };
}

export interface WebBlockConfigs {
  [key: string]: BlockConfig;
}

export interface WebBlockGenerator {
  html: (block: Blockly.Block) => string;
  highLevel: (block: Blockly.Block) => any;
}

export interface WebBlockGeneratorFunctions {
  [key: string]: WebBlockGenerator;
}

export interface BlockConnections {
  previous: string | false;
  next: string | false;
  output?: string;
}

export interface DynamicCardItem {
  icon?: string;
  title?: string;
  description?: string;
}

export interface ComponentNode {
  type: string;
  properties?: Record<string, any>;
  children?: ComponentNode[];
}

import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';

/**
 * Helper functions for text operations that need to be included in generated code
 */
export const textHelperFunctions = {
  // Add any text helper functions here if needed
};

/**
 * Tracker for text helper functions
 */
export class TextFunctionTracker {
  private static usedFunctions = new Set<string>();
  
  static markAsUsed(functionName: string) {
    TextFunctionTracker.usedFunctions.add(functionName);
  }
  
  static reset() {
    TextFunctionTracker.usedFunctions.clear();
  }
  
  static getUsedFunctions() {
    return Array.from(TextFunctionTracker.usedFunctions);
  }
  
  static getUsedFunctionDefinitions() {
    return Array.from(TextFunctionTracker.usedFunctions).map(
      name => textHelperFunctions[name as keyof typeof textHelperFunctions]
    );
  }
}

/**
 * Overrides the default text block generators with custom implementations
 * that track helper function usage.
 */
export function overrideTextGenerators() {
  // Store original init function to reset the tracker
  const originalInit = javascriptGenerator.init;
  javascriptGenerator.init = function(workspace: Blockly.Workspace) {
    originalInit.call(this, workspace);
    TextFunctionTracker.reset();
  };
  
  
} 
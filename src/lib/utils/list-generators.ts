import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';

/**
 * Helper functions for list operations that need to be included in generated code
 */
export const listHelperFunctions = {
  // List repeat function
  listsRepeat: `function listsRepeat(value, n) {
  var array = [];
  for (var i = 0; i < n; i++) {
    array[i] = value;
  }
  return array;
}`,

  // List sort compare function
  listsGetSortCompare: `function listsGetSortCompare(type, direction) {
  var compareFuncs = {
    'NUMERIC': function(a, b) {
        return Number(a) - Number(b); },
    'TEXT': function(a, b) {
        return String(a) > String(b) ? 1 : -1; },
    'IGNORE_CASE': function(a, b) {
        return String(a).toLowerCase() > String(b).toLowerCase() ? 1 : -1; },
  };
  var compare = compareFuncs[type];
  return function(a, b) { return compare(a, b) * direction; };
}`
};

// Define a type for the list helper function names
export type ListHelperFunctionName = keyof typeof listHelperFunctions;

/**
 * Tracks which list helper functions have been used in the generated code
 */
export const ListFunctionTracker = {
  usedFunctions: new Set<ListHelperFunctionName>(),
  
  markAsUsed(functionName: ListHelperFunctionName): void {
    this.usedFunctions.add(functionName);
  },
  
  isUsed(functionName: ListHelperFunctionName): boolean {
    return this.usedFunctions.has(functionName);
  },
  
  reset(): void {
    this.usedFunctions.clear();
  },
  
  /**
   * Get all used list helper functions as a string
   */
  getUsedFunctionDefinitions(): string {
    let code = '';
    this.usedFunctions.forEach(functionName => {
      code += listHelperFunctions[functionName] + '\n\n';
    });
    return code;
  }
};

/**
 * Override list block generators to track helper function usage
 */
export function overrideListGenerators() {
  // Override lists_repeat generator
  javascriptGenerator.forBlock['lists_repeat'] = function(block: Blockly.Block) {
    // Get the item and repeat count
    const item = javascriptGenerator.valueToCode(block, 'ITEM', (javascriptGenerator as any).ORDER_NONE) || 'null';
    const repeatCount = javascriptGenerator.valueToCode(block, 'NUM', (javascriptGenerator as any).ORDER_NONE) || '0';
    
    // Register that this function is needed
    ListFunctionTracker.markAsUsed('listsRepeat');
    
    // Generate the function call directly
    const code = `listsRepeat(${item}, ${repeatCount})`;
    return [code, (javascriptGenerator as any).ORDER_FUNCTION_CALL];
  };

  // Override lists_sort generator
  javascriptGenerator.forBlock['lists_sort'] = function(block: Blockly.Block) {
    // Get the list to sort
    const list = javascriptGenerator.valueToCode(block, 'LIST', (javascriptGenerator as any).ORDER_FUNCTION_CALL) || '[]';
    const type = block.getFieldValue('TYPE');
    const direction = block.getFieldValue('DIRECTION') === '1' ? 1 : -1;
    
    // Register that this function is needed
    ListFunctionTracker.markAsUsed('listsGetSortCompare');
    
    // Generate the function call directly
    const code = `${list}.slice().sort(listsGetSortCompare('${type}', ${direction}))`;
    return [code, (javascriptGenerator as any).ORDER_FUNCTION_CALL];
  };

  // Store original finish function to inject helper functions
  const originalFinish = javascriptGenerator.finish;
  javascriptGenerator.finish = function(code: string) {
    // First call the original finish
    let result = originalFinish.call(this, code);
    
    // Get helper functions
    const helperFunctions = ListFunctionTracker.getUsedFunctionDefinitions();
    
    if (helperFunctions) {
      // For HTML output with script tags
      const scriptTagPos = result.indexOf('<script>');
      
      if (scriptTagPos !== -1) {
        // Insert helper functions at the start of the script block
        const insertPos = scriptTagPos + '<script>'.length;
        result = result.substring(0, insertPos) + '\n' + helperFunctions + '\n' + result.substring(insertPos);
      } else {
        // For pure JavaScript output, add at the beginning
        result = helperFunctions + '\n' + result;
      }
    }
    
    return result;
  };

  // Store original init function to reset the tracker
  const originalInit = javascriptGenerator.init;
  javascriptGenerator.init = function(workspace: Blockly.Workspace) {
    originalInit.call(this, workspace);
    ListFunctionTracker.reset();
  };
} 
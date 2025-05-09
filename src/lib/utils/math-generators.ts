import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';

/**
 * Helper functions for math operations that need to be included in generated code
 */
export const mathHelperFunctions = {
  // Random integer generator function
  mathRandomInt: `function mathRandomInt(a, b) {
  if (a > b) {
    // Swap a and b to ensure a is smaller.
    var c = a;
    a = b;
    b = c;
  }
  return Math.floor(Math.random() * (b - a + 1) + a);
}`,

  // Math mean (average) function
  mathMean: `function mathMean(myList) {
  return myList.reduce(function(x, y) {return x + y;}) / myList.length;
}`,

  // Math modes (most common items) function
  mathModes: `function mathModes(values) {
  var modes = [];
  var counts = [];
  var maxCount = 0;
  for (var i = 0; i < values.length; i++) {
    var value = values[i];
    var found = false;
    var thisCount;
    for (var j = 0; j < counts.length; j++) {
      if (counts[j][0] === value) {
        thisCount = ++counts[j][1];
        found = true;
        break;
      }
    }
    if (!found) {
      counts.push([value, 1]);
      thisCount = 1;
    }
    maxCount = Math.max(thisCount, maxCount);
  }
  for (var j = 0; j < counts.length; j++) {
    if (counts[j][1] == maxCount) {
      modes.push(counts[j][0]);
    }
  }
  return modes;
}`,

  // Math standard deviation function
  mathStandardDeviation: `function mathStandardDeviation(numbers) {
  var n = numbers.length;
  if (!n) return null;
  var mean = numbers.reduce(function(x, y) {return x + y;}) / n;
  var variance = 0;
  for (var j = 0; j < n; j++) {
    variance += Math.pow(numbers[j] - mean, 2);
  }
  variance = variance / n;
  return Math.sqrt(variance);
}`,

  // Math random fraction function
  mathRandomFloat: `function mathRandomFloat() {
  return Math.random();
}`
};

// Define a type for the math helper function names
export type MathHelperFunctionName = keyof typeof mathHelperFunctions;

/**
 * Tracks which math helper functions have been used in the generated code
 */
export const MathFunctionTracker = {
  usedFunctions: new Set<MathHelperFunctionName>(),
  
  markAsUsed(functionName: MathHelperFunctionName): void {
    this.usedFunctions.add(functionName);
  },
  
  isUsed(functionName: MathHelperFunctionName): boolean {
    return this.usedFunctions.has(functionName);
  },
  
  reset(): void {
    this.usedFunctions.clear();
  },
  
  /**
   * Get all used math helper functions as a string
   */
  getUsedFunctionDefinitions(): string {
    let code = '';
    this.usedFunctions.forEach(functionName => {
      code += mathHelperFunctions[functionName] + '\n\n';
    });
    return code;
  }
};

/**
 * Override math block generators to track helper function usage
 */
export function overrideMathGenerators() {
  // Store original init function to reset the tracker
  const originalInit = javascriptGenerator.init;
  javascriptGenerator.init = function(workspace: Blockly.Workspace) {
    originalInit.call(this, workspace);
    MathFunctionTracker.reset();
  };

  // Store original finish function to inject helper functions
  const originalFinish = javascriptGenerator.finish;
  javascriptGenerator.finish = function(code: string) {
    // First call the original finish
    let result = originalFinish.call(this, code);
    
    // Get helper functions
    const helperFunctions = MathFunctionTracker.getUsedFunctionDefinitions();
    
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

  // Override math_random_int generator
  javascriptGenerator.forBlock['math_random_int'] = function(block: Blockly.Block) {
    // Get the values for the range
    const arg0 = javascriptGenerator.valueToCode(block, 'FROM', (javascriptGenerator as any).ORDER_NONE) || '0';
    const arg1 = javascriptGenerator.valueToCode(block, 'TO', (javascriptGenerator as any).ORDER_NONE) || '0';
    
    // Register that this function is needed
    MathFunctionTracker.markAsUsed('mathRandomInt');
    
    // Just generate the function call directly
    const code = `mathRandomInt(${arg0}, ${arg1})`;
    return [code, (javascriptGenerator as any).ORDER_FUNCTION_CALL];
  };

  // Override math_on_list generator for operations that need helper functions
  javascriptGenerator.forBlock['math_on_list'] = function(block: Blockly.Block) {
    const operator = block.getFieldValue('OP');
    
    // Mark appropriate helper functions as used based on the operation
    if (operator === 'AVERAGE') {
      MathFunctionTracker.markAsUsed('mathMean');
    } else if (operator === 'MODE') {
      MathFunctionTracker.markAsUsed('mathModes');
    } else if (operator === 'STD_DEV') {
      MathFunctionTracker.markAsUsed('mathStandardDeviation');
    }
    
    // Implement the functionality directly
    const list = javascriptGenerator.valueToCode(block, 'LIST',
        (javascriptGenerator as any).ORDER_MEMBER) || '[]';
        
    let code;
    switch (operator) {
      case 'SUM':
        code = list + '.reduce(function(x, y) {return x + y;})';
        break;
      case 'MIN':
        code = 'Math.min.apply(null, ' + list + ')';
        break;
      case 'MAX':
        code = 'Math.max.apply(null, ' + list + ')';
        break;
      case 'AVERAGE':
        code = 'mathMean(' + list + ')';
        break;
      case 'MEDIAN':
        code = 'Math.median(' + list + ')';
        break;
      case 'MODE':
        code = 'mathModes(' + list + ')';
        break;
      case 'STD_DEV':
        code = 'mathStandardDeviation(' + list + ')';
        break;
      case 'RANDOM':
        code = list + '[Math.floor(Math.random() * ' + list + '.length)]';
        break;
      default:
        throw Error('Unknown operator: ' + operator);
    }
    
    return [code, (javascriptGenerator as any).ORDER_FUNCTION_CALL];
  };
} 
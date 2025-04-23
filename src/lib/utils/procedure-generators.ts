import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

// Prevent recursive calls
let inProcedureGeneration = false;

export interface ProcedureInfo {
  functionName: string;
  params: string[];
  stackCode: string;
  returnValue?: string;
}

/**
 * Extract procedure information from a block
 */
export function extractProcedureInfo(block: Blockly.Block): ProcedureInfo {
  // Default values
  let functionName = 'unnamed_procedure';
  let params: string[] = [];
  
  // Get function name
  if (block && block.getFieldValue) {
    const nameFromField = block.getFieldValue('NAME');
    if (nameFromField) functionName = nameFromField;
  }
  
  // Get parameters from mutation
  if (block && block.mutationToDom) {
    try {
      const mutation = block.mutationToDom();
      if (mutation) {
        // Extract parameters from arg elements
        for (let i = 0; i < mutation.childNodes.length; i++) {
          const child = mutation.childNodes[i];
          if (child.nodeName.toLowerCase() === 'arg') {
            // Type assertion to Element
            const argElement = child as Element;
            const paramName = argElement.getAttribute('name');
            if (paramName) params.push(paramName);
          }
        }
        console.log(`Extracted ${params.length} parameters for function ${functionName}:`, params);
      }
    } catch (e) {
      console.warn("Error extracting parameters from mutation:", e);
    }
  }

  // Extract stack code
  let stackCode = '';
  if (block.getInput && block.getInput('STACK')) {
    const stackInput = block.getInput('STACK');
    if (stackInput && stackInput.connection && stackInput.connection.targetBlock()) {
      // Temporarily disable our generator to avoid recursion
      const tempGeneratorNoReturn = javascriptGenerator.forBlock['procedures_defnoreturn'];
      const tempGeneratorReturn = javascriptGenerator.forBlock['procedures_defreturn'];
      
      javascriptGenerator.forBlock['procedures_defnoreturn'] = function() { return ''; };
      javascriptGenerator.forBlock['procedures_defreturn'] = function() { return ''; };
      
      try {
        stackCode = javascriptGenerator.statementToCode(block, 'STACK');
      } catch (e) {
        console.warn("Error generating STACK code:", e);
      }
      
      // Restore our generators
      javascriptGenerator.forBlock['procedures_defnoreturn'] = tempGeneratorNoReturn;
      javascriptGenerator.forBlock['procedures_defreturn'] = tempGeneratorReturn;
    }
  }
  
  // If stackCode is empty, add a placeholder comment
  if (!stackCode || !stackCode.trim()) {
    stackCode = '  // Procedure body is empty\n';
  }
  
  // Extract return value for functions with return
  let returnValue = '';
  if (block.getInput && block.getInput('RETURN')) {
    try {
      returnValue = javascriptGenerator.valueToCode(
        block, 'RETURN', javascriptGenerator.ORDER_NONE
      ) || 'null';
    } catch (e) {
      console.warn("Error extracting return value:", e);
      returnValue = 'null';
    }
  }
  
  return { functionName, params, stackCode, returnValue };
}

/**
 * Generate fallback procedure code 
 */
export function generateProcedureCode(info: ProcedureInfo, hasReturn: boolean): string {
  const { functionName, params, stackCode, returnValue } = info;
  const paramList = params.join(', ');
  
  if (hasReturn) {
    // For procedures with return values
    return `// Fallback procedure definition with return
function ${functionName}(${paramList}) {
${stackCode}  return ${returnValue || 'null'}; // Return value
}`;
  } else {
    // For procedures without return values
    return `// Fallback procedure definition
function ${functionName}(${paramList}) {
${stackCode}}`;
  }
}

/**
 * Safely call a procedure generator with recursion protection
 */
export function safeProcedureGeneration(
  block: Blockly.Block,
  originalGenerator: Function,
  hasReturn: boolean
): string | [string, number] | null {
  // Prevent recursive calls
  if (inProcedureGeneration) {
    return null; // Return null to break recursion
  }
  
  inProcedureGeneration = true;
  
  try {
    // Try original generator
    try {
      const code = originalGenerator.call(javascriptGenerator, block);
      
      // Only return the original code if it's not empty
      if (code) {
        if (typeof code === 'string') {
          if (code.trim()) {
            inProcedureGeneration = false;
            return code;
          }
        } else if (Array.isArray(code) && code.length === 2 && typeof code[0] === 'string' && typeof code[1] === 'number' && code[0].trim()) {
          inProcedureGeneration = false;
          return code as [string, number];
        }
      }
      // If we get here, code exists but is empty or invalid
      throw new Error('Original generator returned empty code');
    } catch (originalError) {
      console.warn("Original generator failed, using fallback", originalError);
      
      // Extract procedure info and generate code
      const info = extractProcedureInfo(block);
      const code = generateProcedureCode(info, hasReturn);
      
      inProcedureGeneration = false;
      return code;
    }
  } catch (e) {
    console.error('Error in procedure generator:', e);
    inProcedureGeneration = false;
    return hasReturn 
      ? 'function unnamed_procedure() { return null; }\n'
      : 'function unnamed_procedure() {}\n';
  }
}
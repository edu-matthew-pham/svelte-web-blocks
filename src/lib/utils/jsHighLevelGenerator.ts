import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import { VariableTracker } from './blockly-overrides.js';

/**
 * Registers high-level JSON generators for standard Blockly blocks
 */
export function registerHighLevelGenerators() {
  // Variables blocks
  registerVariableBlockGenerators();
  
  // Logic blocks
  registerLogicBlockGenerators();
  
  // Loop blocks
  registerLoopBlockGenerators();
  
  // Math blocks
  registerMathBlockGenerators();
  
  // Text blocks
  registerTextBlockGenerators();
}

// ===== Variable Blocks =====
function registerVariableBlockGenerators() {
  // variables_set
  javascriptGenerator.forBlock['variables_set'].highLevel = function(block: Blockly.Block) {
    const variableId = block.getFieldValue('VAR');
    
    // Get the actual variable model to access user-facing name
    const variable = block.workspace.getVariableById(variableId);
    const variableName = variable ? variable.name : 
      javascriptGenerator.nameDB_!.getName(variableId, Blockly.Names.NameType.VARIABLE);
    
    // Get the value connected to this variable
    const valueBlock = block.getInputTargetBlock('VALUE');
    let valueRepresentation = null;
    
    if (valueBlock) {
      // Try to get high-level representation
      valueRepresentation = javascriptGenerator.blockToHighLevel(valueBlock);
      
      // If high-level representation fails but we can get code, create a basic representation
      if (!valueRepresentation) {
        const code = javascriptGenerator.valueToCode(block, 'VALUE', (javascriptGenerator as any).ORDER_ASSIGNMENT);
        if (code) {
          valueRepresentation = { type: 'literal', value: code };
        }
      }
    }
    
    return {
      type: 'variables_set',
      variableName: variableName,
      variableId: variableId,
      isDeclared: VariableTracker.isDeclared(variableId),
      value: valueRepresentation || { type: 'literal', value: '0' }
    };
  };
  
  // variables_get
  javascriptGenerator.forBlock['variables_get'].highLevel = function(block: Blockly.Block) {
    const variableId = block.getFieldValue('VAR');
    // Get the actual variable model to access user-facing name
    const variable = block.workspace.getVariableById(variableId);
    const variableName = variable ? variable.name : 
      javascriptGenerator.nameDB_!.getName(variableId, Blockly.Names.NameType.VARIABLE);
    
    return {
      type: 'variables_get',
      variableName: variableName,
      variableId: variableId
    };
  };
}

// ===== Logic Blocks =====
function registerLogicBlockGenerators() {
  // controls_if
  javascriptGenerator.forBlock['controls_if'].highLevel = function(block: Blockly.Block) {
    // Number of if/else clauses
    const clauseCount = (block as any).elseifCount_ || 0;
    // Has else clause?
    const hasElse = (block as any).elseCount_ === 1;
    
    // Build clauses array
    const clauses = [];
    
    // Process if and else if clauses
    for (let i = 0; i <= clauseCount; i++) {
      // Condition
      const conditionBlock = block.getInputTargetBlock('IF' + i);
      let condition = null;
      if (conditionBlock) {
        condition = javascriptGenerator.blockToHighLevel(conditionBlock);
      }
      
      // DO statements
      const statements = [];
      let statementBlock = block.getInputTargetBlock('DO' + i);
      while (statementBlock) {
        const statement = javascriptGenerator.blockToHighLevel(statementBlock);
        if (statement) statements.push(statement);
        statementBlock = statementBlock.getNextBlock();
      }
      
      clauses.push({
        condition: condition,
        statements: statements
      });
    }
    
    // Process else clause if it exists
    let elseStatements = [];
    if (hasElse) {
      let elseBlock = block.getInputTargetBlock('ELSE');
      while (elseBlock) {
        const statement = javascriptGenerator.blockToHighLevel(elseBlock);
        if (statement) elseStatements.push(statement);
        elseBlock = elseBlock.getNextBlock();
      }
    }
    
    return {
      type: 'controls_if',
      clauses: clauses,
      hasElse: hasElse,
      elseStatements: hasElse ? elseStatements : undefined
    };
  };
  
  // logic_compare
  javascriptGenerator.forBlock['logic_compare'].highLevel = function(block: Blockly.Block) {
    const operator = block.getFieldValue('OP');
    
    // Get inputs
    const leftBlock = block.getInputTargetBlock('A');
    const rightBlock = block.getInputTargetBlock('B');
    
    let left = null;
    let right = null;
    
    if (leftBlock) {
      left = javascriptGenerator.blockToHighLevel(leftBlock);
    }
    
    if (rightBlock) {
      right = javascriptGenerator.blockToHighLevel(rightBlock);
    }
    
    return {
      type: 'logic_compare',
      operator: operator,
      left: left,
      right: right
    };
  };
}

// ===== Loop Blocks =====
function registerLoopBlockGenerators() {
  // controls_repeat_ext
  javascriptGenerator.forBlock['controls_repeat_ext'].highLevel = function(block: Blockly.Block) {
    // Get number of times to repeat
    const timesBlock = block.getInputTargetBlock('TIMES');
    let times = null;
    if (timesBlock) {
      times = javascriptGenerator.blockToHighLevel(timesBlock);
    }
    
    // Get loop statements
    const statements = [];
    let statementBlock = block.getInputTargetBlock('DO');
    while (statementBlock) {
      const statement = javascriptGenerator.blockToHighLevel(statementBlock);
      if (statement) statements.push(statement);
      statementBlock = statementBlock.getNextBlock();
    }
    
    return {
      type: 'controls_repeat_ext',
      times: times,
      statements: statements
    };
  };
  
  // controls_forEach
  javascriptGenerator.forBlock['controls_forEach'].highLevel = function(block: Blockly.Block) {
    const variableId = block.getFieldValue('VAR');
    // Get the actual variable model to access user-facing name
    const variable = block.workspace.getVariableById(variableId);
    const variableName = variable ? variable.name : 
      javascriptGenerator.nameDB_!.getName(variableId, Blockly.Names.NameType.VARIABLE);
    
    // Get list to iterate over
    const listBlock = block.getInputTargetBlock('LIST');
    let list = null;
    if (listBlock) {
      list = javascriptGenerator.blockToHighLevel(listBlock);
    }
    
    // Get loop statements
    const statements = [];
    let statementBlock = block.getInputTargetBlock('DO');
    while (statementBlock) {
      const statement = javascriptGenerator.blockToHighLevel(statementBlock);
      if (statement) statements.push(statement);
      statementBlock = statementBlock.getNextBlock();
    }
    
    return {
      type: 'controls_forEach',
      variableName: variableName,
      variableId: variableId,
      list: list,
      statements: statements
    };
  };
}

// ===== Math Blocks =====
function registerMathBlockGenerators() {
  // math_number
  javascriptGenerator.forBlock['math_number'].highLevel = function(block: Blockly.Block) {
    const number = parseFloat(block.getFieldValue('NUM'));
    return {
      type: 'math_number',
      value: number
    };
  };
  
  // math_arithmetic
  javascriptGenerator.forBlock['math_arithmetic'].highLevel = function(block: Blockly.Block) {
    const operator = block.getFieldValue('OP');
    
    // Get inputs
    const leftBlock = block.getInputTargetBlock('A');
    const rightBlock = block.getInputTargetBlock('B');
    
    let left = null;
    let right = null;
    
    if (leftBlock) {
      left = javascriptGenerator.blockToHighLevel(leftBlock);
    }
    
    if (rightBlock) {
      right = javascriptGenerator.blockToHighLevel(rightBlock);
    }
    
    return {
      type: 'math_arithmetic',
      operator: operator,
      left: left,
      right: right
    };
  };
}

// ===== Text Blocks =====
function registerTextBlockGenerators() {
  // text
  javascriptGenerator.forBlock['text'].highLevel = function(block: Blockly.Block) {
    const text = block.getFieldValue('TEXT');
    return {
      type: 'text',
      value: text
    };
  };
  
  // text_join
  javascriptGenerator.forBlock['text_join'].highLevel = function(block: Blockly.Block) {
    // Number of text items to join
    const itemCount = (block as any).itemCount_ || 0;
    
    // Get all text pieces
    const items = [];
    for (let i = 0; i < itemCount; i++) {
      const itemBlock = block.getInputTargetBlock('ADD' + i);
      let item = null;
      if (itemBlock) {
        item = javascriptGenerator.blockToHighLevel(itemBlock);
      }
      items.push(item);
    }
    
    return {
      type: 'text_join',
      items: items
    };
  };
} 
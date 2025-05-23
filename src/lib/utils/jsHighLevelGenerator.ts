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
  
  // List blocks
  registerListBlockGenerators();
  
  // Function/Procedure blocks
  registerFunctionBlockGenerators();
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
        // Instead of creating a basic representation, return an error object
        const blockType = block.type;
        const blockId = block.id;
        console.warn(`High-level representation missing for block type: ${blockType}, id: ${blockId}`);
        valueRepresentation = { 
          type: 'error', 
          message: `Missing high-level representation for block type: ${blockType}`,
          blockId: blockId 
        };
      }
    }
    
    return {
      type: 'variables_set',
      properties: {
        variableName: variableName,
        variableId: variableId,
        isDeclared: VariableTracker.isDeclared(variableId),
        value: valueRepresentation || { type: 'literal', value: '0' }
      }
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
      properties: {
        variableName: variableName,
        variableId: variableId
      }
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
      properties: {
        clauses: clauses,
        hasElse: hasElse,
        elseStatements: hasElse ? elseStatements : undefined
      }
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
      properties: {
        operator: operator,
        left: left,
        right: right
      }
    };
  };
  
  // logic_operation (AND/OR)
  javascriptGenerator.forBlock['logic_operation'].highLevel = function(block: Blockly.Block) {
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
      type: 'logic_operation',
      properties: {
        operator: operator, // 'AND' or 'OR'
        left: left,
        right: right
      }
    };
  };
  
  // logic_negate (NOT)
  javascriptGenerator.forBlock['logic_negate'].highLevel = function(block: Blockly.Block) {
    // Get input
    const inputBlock = block.getInputTargetBlock('BOOL');
    let input = null;
    
    if (inputBlock) {
      input = javascriptGenerator.blockToHighLevel(inputBlock);
    }
    
    return {
      type: 'logic_negate',
      properties: {
        input: input
      }
    };
  };
  
  // logic_boolean (TRUE/FALSE)
  javascriptGenerator.forBlock['logic_boolean'].highLevel = function(block: Blockly.Block) {
    const value = block.getFieldValue('BOOL') === 'TRUE';
    
    return {
      type: 'logic_boolean',
      properties: {
        value: value
      }
    };
  };
  
  // logic_null
  javascriptGenerator.forBlock['logic_null'].highLevel = function(block: Blockly.Block) {
    return {
      type: 'logic_null',
      properties: {}
    };
  };
  
  // logic_ternary (condition ? if_true : if_false)
  javascriptGenerator.forBlock['logic_ternary'].highLevel = function(block: Blockly.Block) {
    // Get condition
    const conditionBlock = block.getInputTargetBlock('IF');
    let condition = null;
    if (conditionBlock) {
      condition = javascriptGenerator.blockToHighLevel(conditionBlock);
    }
    
    // Get "then" value
    const thenBlock = block.getInputTargetBlock('THEN');
    let thenValue = null;
    if (thenBlock) {
      thenValue = javascriptGenerator.blockToHighLevel(thenBlock);
    }
    
    // Get "else" value
    const elseBlock = block.getInputTargetBlock('ELSE');
    let elseValue = null;
    if (elseBlock) {
      elseValue = javascriptGenerator.blockToHighLevel(elseBlock);
    }
    
    return {
      type: 'logic_ternary',
      properties: {
        condition: condition,
        thenValue: thenValue,
        elseValue: elseValue
      }
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
      properties: {
        times: times,
        statements: statements
      }
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
      properties: {
        variableName: variableName,
        variableId: variableId,
        list: list,
        statements: statements
      }
    };
  };
  
  // controls_whileUntil (while/until loop)
  javascriptGenerator.forBlock['controls_whileUntil'].highLevel = function(block: Blockly.Block) {
    const mode = block.getFieldValue('MODE'); // 'WHILE' or 'UNTIL'
    
    // Get condition
    const conditionBlock = block.getInputTargetBlock('BOOL');
    let condition = null;
    if (conditionBlock) {
      condition = javascriptGenerator.blockToHighLevel(conditionBlock);
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
      type: 'controls_whileUntil',
      properties: {
        mode: mode,
        condition: condition,
        statements: statements
      }
    };
  };
  
  // controls_for (counting loop with variable)
  javascriptGenerator.forBlock['controls_for'].highLevel = function(block: Blockly.Block) {
    const variableId = block.getFieldValue('VAR');
    // Get the actual variable model to access user-facing name
    const variable = block.workspace.getVariableById(variableId);
    const variableName = variable ? variable.name : 
      javascriptGenerator.nameDB_!.getName(variableId, Blockly.Names.NameType.VARIABLE);
    
    // Get range values (FROM, TO, BY)
    const fromBlock = block.getInputTargetBlock('FROM');
    let from = null;
    if (fromBlock) {
      from = javascriptGenerator.blockToHighLevel(fromBlock);
    }
    
    const toBlock = block.getInputTargetBlock('TO');
    let to = null;
    if (toBlock) {
      to = javascriptGenerator.blockToHighLevel(toBlock);
    }
    
    const byBlock = block.getInputTargetBlock('BY');
    let by = null;
    if (byBlock) {
      by = javascriptGenerator.blockToHighLevel(byBlock);
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
      type: 'controls_for',
      properties: {
        variableName: variableName,
        variableId: variableId,
        from: from,
        to: to,
        by: by,
        statements: statements
      }
    };
  };
  
  // controls_flow_statements (break/continue)
  javascriptGenerator.forBlock['controls_flow_statements'].highLevel = function(block: Blockly.Block) {
    const flow = block.getFieldValue('FLOW'); // 'BREAK' or 'CONTINUE'
    
    return {
      type: 'controls_flow_statements',
      properties: {
        flow: flow
      }
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
      properties: {
        value: number
      }
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
      properties: {
        operator: operator,
        left: left,
        right: right
      }
    };
  };
  
  // math_single (sqrt, abs, etc.)
  javascriptGenerator.forBlock['math_single'].highLevel = function(block: Blockly.Block) {
    const operator = block.getFieldValue('OP');
    
    // Get input value
    const valueBlock = block.getInputTargetBlock('NUM');
    let value = null;
    if (valueBlock) {
      value = javascriptGenerator.blockToHighLevel(valueBlock);
    }
    
    return {
      type: 'math_single',
      properties: {
        operator: operator,
        value: value
      }
    };
  };
  
  // math_trig (sin, cos, tan, etc.)
  javascriptGenerator.forBlock['math_trig'].highLevel = function(block: Blockly.Block) {
    const operator = block.getFieldValue('OP');
    
    // Get input value
    const valueBlock = block.getInputTargetBlock('NUM');
    let value = null;
    if (valueBlock) {
      value = javascriptGenerator.blockToHighLevel(valueBlock);
    }
    
    return {
      type: 'math_trig',
      properties: {
        operator: operator,
        value: value
      }
    };
  };
  
  // math_constant (PI, E, etc.)
  javascriptGenerator.forBlock['math_constant'].highLevel = function(block: Blockly.Block) {
    const constant = block.getFieldValue('CONSTANT');
    
    return {
      type: 'math_constant',
      properties: {
        constant: constant
      }
    };
  };
  
  // math_round (round, ceil, floor)
  javascriptGenerator.forBlock['math_round'].highLevel = function(block: Blockly.Block) {
    const operator = block.getFieldValue('OP');
    
    // Get input value
    const valueBlock = block.getInputTargetBlock('NUM');
    let value = null;
    if (valueBlock) {
      value = javascriptGenerator.blockToHighLevel(valueBlock);
    }
    
    return {
      type: 'math_round',
      properties: {
        operator: operator,
        value: value
      }
    };
  };
  
  // math_on_list (sum, min, max, average, etc.)
  javascriptGenerator.forBlock['math_on_list'].highLevel = function(block: Blockly.Block) {
    const operator = block.getFieldValue('OP');
    
    // Get list
    const listBlock = block.getInputTargetBlock('LIST');
    let list = null;
    if (listBlock) {
      list = javascriptGenerator.blockToHighLevel(listBlock);
    }
    
    return {
      type: 'math_on_list',
      properties: {
        operator: operator,
        list: list
      }
    };
  };
  
  // math_modulo
  javascriptGenerator.forBlock['math_modulo'].highLevel = function(block: Blockly.Block) {
    // Get dividend
    const dividendBlock = block.getInputTargetBlock('DIVIDEND');
    let dividend = null;
    if (dividendBlock) {
      dividend = javascriptGenerator.blockToHighLevel(dividendBlock);
    }
    
    // Get divisor
    const divisorBlock = block.getInputTargetBlock('DIVISOR');
    let divisor = null;
    if (divisorBlock) {
      divisor = javascriptGenerator.blockToHighLevel(divisorBlock);
    }
    
    return {
      type: 'math_modulo',
      properties: {
        dividend: dividend,
        divisor: divisor
      }
    };
  };
  
  // math_constrain
  javascriptGenerator.forBlock['math_constrain'].highLevel = function(block: Blockly.Block) {
    // Get value
    const valueBlock = block.getInputTargetBlock('VALUE');
    let value = null;
    if (valueBlock) {
      value = javascriptGenerator.blockToHighLevel(valueBlock);
    }
    
    // Get low bound
    const lowBlock = block.getInputTargetBlock('LOW');
    let low = null;
    if (lowBlock) {
      low = javascriptGenerator.blockToHighLevel(lowBlock);
    }
    
    // Get high bound
    const highBlock = block.getInputTargetBlock('HIGH');
    let high = null;
    if (highBlock) {
      high = javascriptGenerator.blockToHighLevel(highBlock);
    }
    
    return {
      type: 'math_constrain',
      properties: {
        value: value,
        low: low,
        high: high
      }
    };
  };
  
  // math_random_int
  javascriptGenerator.forBlock['math_random_int'].highLevel = function(block: Blockly.Block) {
    // Get from value
    const fromBlock = block.getInputTargetBlock('FROM');
    let from = null;
    if (fromBlock) {
      from = javascriptGenerator.blockToHighLevel(fromBlock);
    }
    
    // Get to value
    const toBlock = block.getInputTargetBlock('TO');
    let to = null;
    if (toBlock) {
      to = javascriptGenerator.blockToHighLevel(toBlock);
    }
    
    return {
      type: 'math_random_int',
      properties: {
        from: from,
        to: to
      }
    };
  };
  
  // math_random_float
  javascriptGenerator.forBlock['math_random_float'].highLevel = function(block: Blockly.Block) {
    return {
      type: 'math_random_float',
      properties: {}
    };
  };
  
  // math_number_property (even, odd, prime, etc.)
  javascriptGenerator.forBlock['math_number_property'].highLevel = function(block: Blockly.Block) {
    const property = block.getFieldValue('PROPERTY');
    
    // Get number to check
    const numberBlock = block.getInputTargetBlock('NUMBER_TO_CHECK');
    let number = null;
    if (numberBlock) {
      number = javascriptGenerator.blockToHighLevel(numberBlock);
    }
    
    // Get divisor for "divisible by" property, if applicable
    let divisor = null;
    if (property === 'DIVISIBLE_BY') {
      const divisorBlock = block.getInputTargetBlock('DIVISOR');
      if (divisorBlock) {
        divisor = javascriptGenerator.blockToHighLevel(divisorBlock);
      }
    }
    
    return {
      type: 'math_number_property',
      properties: {
        property: property,
        number: number,
        divisor: divisor
      }
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
      properties: {
        value: text
      }
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
      properties: {
        items: items
      }
    };
  };
  
  // text_length
  javascriptGenerator.forBlock['text_length'].highLevel = function(block: Blockly.Block) {
    // Get input text
    const valueBlock = block.getInputTargetBlock('VALUE');
    let value = null;
    if (valueBlock) {
      value = javascriptGenerator.blockToHighLevel(valueBlock);
    }
    
    return {
      type: 'text_length',
      properties: {
        value: value
      }
    };
  };
  
  // text_isEmpty
  javascriptGenerator.forBlock['text_isEmpty'].highLevel = function(block: Blockly.Block) {
    // Get input text
    const valueBlock = block.getInputTargetBlock('VALUE');
    let value = null;
    if (valueBlock) {
      value = javascriptGenerator.blockToHighLevel(valueBlock);
    }
    
    return {
      type: 'text_isEmpty',
      properties: {
        value: value
      }
    };
  };
  
  // text_indexOf
  javascriptGenerator.forBlock['text_indexOf'].highLevel = function(block: Blockly.Block) {
    const end = block.getFieldValue('END'); // 'FIRST' or 'LAST'
    
    // Get text to search in
    const valueBlock = block.getInputTargetBlock('VALUE');
    let value = null;
    if (valueBlock) {
      value = javascriptGenerator.blockToHighLevel(valueBlock);
    }
    
    // Get text to find
    const findBlock = block.getInputTargetBlock('FIND');
    let find = null;
    if (findBlock) {
      find = javascriptGenerator.blockToHighLevel(findBlock);
    }
    
    return {
      type: 'text_indexOf',
      properties: {
        end: end,
        value: value,
        find: find
      }
    };
  };
  
  // text_charAt
  javascriptGenerator.forBlock['text_charAt'].highLevel = function(block: Blockly.Block) {
    const where = block.getFieldValue('WHERE');
    
    // Get input text
    const valueBlock = block.getInputTargetBlock('VALUE');
    let value = null;
    if (valueBlock) {
      value = javascriptGenerator.blockToHighLevel(valueBlock);
    }
    
    // Get position (AT)
    let at = null;
    if (where !== 'RANDOM') {
      const atBlock = block.getInputTargetBlock('AT');
      if (atBlock) {
        at = javascriptGenerator.blockToHighLevel(atBlock);
      }
    }
    
    return {
      type: 'text_charAt',
      properties: {
        where: where,
        value: value,
        at: at
      }
    };
  };
  
  // text_getSubstring
  javascriptGenerator.forBlock['text_getSubstring'].highLevel = function(block: Blockly.Block) {
    const where1 = block.getFieldValue('WHERE1');
    const where2 = block.getFieldValue('WHERE2');
    
    // Get input text
    const stringBlock = block.getInputTargetBlock('STRING');
    let string = null;
    if (stringBlock) {
      string = javascriptGenerator.blockToHighLevel(stringBlock);
    }
    
    // Get AT1 position
    let at1 = null;
    if (where1 !== 'FIRST' && where1 !== 'LAST' && where1 !== 'FROM_END') {
      const at1Block = block.getInputTargetBlock('AT1');
      if (at1Block) {
        at1 = javascriptGenerator.blockToHighLevel(at1Block);
      }
    }
    
    // Get AT2 position
    let at2 = null;
    if (where2 !== 'FIRST' && where2 !== 'LAST' && where2 !== 'FROM_END') {
      const at2Block = block.getInputTargetBlock('AT2');
      if (at2Block) {
        at2 = javascriptGenerator.blockToHighLevel(at2Block);
      }
    }
    
    return {
      type: 'text_getSubstring',
      properties: {
        where1: where1,
        where2: where2,
        string: string,
        at1: at1,
        at2: at2
      }
    };
  };
  
  // text_changeCase
  javascriptGenerator.forBlock['text_changeCase'].highLevel = function(block: Blockly.Block) {
    const caseType = block.getFieldValue('CASE');
    
    // Get input text
    const textBlock = block.getInputTargetBlock('TEXT');
    let text = null;
    if (textBlock) {
      text = javascriptGenerator.blockToHighLevel(textBlock);
    }
    
    return {
      type: 'text_changeCase',
      properties: {
        case: caseType,
        text: text
      }
    };
  };
  
  // text_trim
  javascriptGenerator.forBlock['text_trim'].highLevel = function(block: Blockly.Block) {
    const mode = block.getFieldValue('MODE');
    
    // Get input text
    const textBlock = block.getInputTargetBlock('TEXT');
    let text = null;
    if (textBlock) {
      text = javascriptGenerator.blockToHighLevel(textBlock);
    }
    
    return {
      type: 'text_trim',
      properties: {
        mode: mode,
        text: text
      }
    };
  };
  
  // text_print
  javascriptGenerator.forBlock['text_print'].highLevel = function(block: Blockly.Block) {
    // Get text to print
    const textBlock = block.getInputTargetBlock('TEXT');
    let text = null;
    if (textBlock) {
      text = javascriptGenerator.blockToHighLevel(textBlock);
    }
    
    return {
      type: 'text_print',
      properties: {
        text: text
      }
    };
  };
  
  // text_prompt_ext
  javascriptGenerator.forBlock['text_prompt_ext'].highLevel = function(block: Blockly.Block) {
    const type = block.getFieldValue('TYPE');
    
    // Get prompt text
    const textBlock = block.getInputTargetBlock('TEXT');
    let text = null;
    if (textBlock) {
      text = javascriptGenerator.blockToHighLevel(textBlock);
    }
    
    return {
      type: 'text_prompt_ext',
      properties: {
        type: type,
        text: text
      }
    };
  };
}

// ===== List Blocks =====
function registerListBlockGenerators() {
  // lists_create_empty
  javascriptGenerator.forBlock['lists_create_empty'].highLevel = function(block: Blockly.Block) {
    return {
      type: 'lists_create_empty',
      properties: {}
    };
  };
  
  // lists_repeat
  javascriptGenerator.forBlock['lists_repeat'].highLevel = function(block: Blockly.Block) {
    // Get item to repeat
    const itemBlock = block.getInputTargetBlock('ITEM');
    let item = null;
    if (itemBlock) {
      item = javascriptGenerator.blockToHighLevel(itemBlock);
    }
    
    // Get number of repetitions
    const timesBlock = block.getInputTargetBlock('NUM');
    let times = null;
    if (timesBlock) {
      times = javascriptGenerator.blockToHighLevel(timesBlock);
    }
    
    return {
      type: 'lists_repeat',
      properties: {
        item: item,
        times: times
      }
    };
  };
  
  // lists_length
  javascriptGenerator.forBlock['lists_length'].highLevel = function(block: Blockly.Block) {
    // Get list
    const valueBlock = block.getInputTargetBlock('VALUE');
    let value = null;
    if (valueBlock) {
      value = javascriptGenerator.blockToHighLevel(valueBlock);
    }
    
    return {
      type: 'lists_length',
      properties: {
        list: value
      }
    };
  };
  
  // lists_isEmpty
  javascriptGenerator.forBlock['lists_isEmpty'].highLevel = function(block: Blockly.Block) {
    // Get list
    const valueBlock = block.getInputTargetBlock('VALUE');
    let value = null;
    if (valueBlock) {
      value = javascriptGenerator.blockToHighLevel(valueBlock);
    }
    
    return {
      type: 'lists_isEmpty',
      properties: {
        list: value
      }
    };
  };
  
  // lists_indexOf
  javascriptGenerator.forBlock['lists_indexOf'].highLevel = function(block: Blockly.Block) {
    const end = block.getFieldValue('END'); // 'FIRST' or 'LAST'
    
    // Get list
    const valueBlock = block.getInputTargetBlock('VALUE');
    let value = null;
    if (valueBlock) {
      value = javascriptGenerator.blockToHighLevel(valueBlock);
    }
    
    // Get item to find
    const findBlock = block.getInputTargetBlock('FIND');
    let find = null;
    if (findBlock) {
      find = javascriptGenerator.blockToHighLevel(findBlock);
    }
    
    return {
      type: 'lists_indexOf',
      properties: {
        end: end,
        list: value,
        item: find
      }
    };
  };
  
  // lists_getIndex
  javascriptGenerator.forBlock['lists_getIndex'].highLevel = function(block: Blockly.Block) {
    const mode = block.getFieldValue('MODE'); // 'GET', 'GET_REMOVE', or 'REMOVE'
    const where = block.getFieldValue('WHERE'); // 'FROM_START', 'FROM_END', 'FIRST', 'LAST', 'RANDOM'
    
    // Get list
    const valueBlock = block.getInputTargetBlock('VALUE');
    let value = null;
    if (valueBlock) {
      value = javascriptGenerator.blockToHighLevel(valueBlock);
    }
    
    // Get index if applicable
    let at = null;
    if (where === 'FROM_START' || where === 'FROM_END') {
      const atBlock = block.getInputTargetBlock('AT');
      if (atBlock) {
        at = javascriptGenerator.blockToHighLevel(atBlock);
      }
    }
    
    return {
      type: 'lists_getIndex',
      properties: {
        mode: mode,
        where: where,
        list: value,
        at: at
      }
    };
  };
  
  // lists_setIndex
  javascriptGenerator.forBlock['lists_setIndex'].highLevel = function(block: Blockly.Block) {
    const mode = block.getFieldValue('MODE'); // 'SET' or 'INSERT'
    const where = block.getFieldValue('WHERE'); // 'FROM_START', 'FROM_END', 'FIRST', 'LAST', 'RANDOM'
    
    // Get list
    const listBlock = block.getInputTargetBlock('LIST');
    let list = null;
    if (listBlock) {
      list = javascriptGenerator.blockToHighLevel(listBlock);
    }
    
    // Get index if applicable
    let at = null;
    if (where === 'FROM_START' || where === 'FROM_END') {
      const atBlock = block.getInputTargetBlock('AT');
      if (atBlock) {
        at = javascriptGenerator.blockToHighLevel(atBlock);
      }
    }
    
    // Get item to set or insert
    const toBlock = block.getInputTargetBlock('TO');
    let to = null;
    if (toBlock) {
      to = javascriptGenerator.blockToHighLevel(toBlock);
    }
    
    return {
      type: 'lists_setIndex',
      properties: {
        mode: mode,
        where: where,
        list: list,
        at: at,
        to: to
      }
    };
  };
  
  // lists_getSublist
  javascriptGenerator.forBlock['lists_getSublist'].highLevel = function(block: Blockly.Block) {
    const where1 = block.getFieldValue('WHERE1'); // Start position: 'FROM_START', 'FROM_END', 'FIRST'
    const where2 = block.getFieldValue('WHERE2'); // End position: 'FROM_START', 'FROM_END', 'LAST'
    
    // Get list
    const listBlock = block.getInputTargetBlock('LIST');
    let list = null;
    if (listBlock) {
      list = javascriptGenerator.blockToHighLevel(listBlock);
    }
    
    // Get start position if applicable
    let at1 = null;
    if (where1 === 'FROM_START' || where1 === 'FROM_END') {
      const at1Block = block.getInputTargetBlock('AT1');
      if (at1Block) {
        at1 = javascriptGenerator.blockToHighLevel(at1Block);
      }
    }
    
    // Get end position if applicable
    let at2 = null;
    if (where2 === 'FROM_START' || where2 === 'FROM_END') {
      const at2Block = block.getInputTargetBlock('AT2');
      if (at2Block) {
        at2 = javascriptGenerator.blockToHighLevel(at2Block);
      }
    }
    
    return {
      type: 'lists_getSublist',
      properties: {
        where1: where1,
        where2: where2,
        list: list,
        at1: at1,
        at2: at2
      }
    };
  };
  
  // lists_sort
  javascriptGenerator.forBlock['lists_sort'].highLevel = function(block: Blockly.Block) {
    const type = block.getFieldValue('TYPE'); // 'NUMERIC', 'TEXT', or 'IGNORE_CASE'
    const direction = parseInt(block.getFieldValue('DIRECTION')); // 1 for ascending, -1 for descending
    
    // Get list to sort
    const listBlock = block.getInputTargetBlock('LIST');
    let list = null;
    if (listBlock) {
      list = javascriptGenerator.blockToHighLevel(listBlock);
    }
    
    return {
      type: 'lists_sort',
      properties: {
        type: type,
        direction: direction,
        list: list
      }
    };
  };
  
  // lists_create_with
  if (javascriptGenerator.forBlock['lists_create_with']) {
    javascriptGenerator.forBlock['lists_create_with'].highLevel = function(block: Blockly.Block) {
      // Number of items in the list
      const itemCount = (block as any).itemCount_ || 0;
      
      // Get all list items
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
        type: 'lists_create_with',
        properties: {
          items: items
        }
      };
    };
  }
  
  // lists_split (for splitting/joining text and lists)
  if (javascriptGenerator.forBlock['lists_split']) {
    javascriptGenerator.forBlock['lists_split'].highLevel = function(block: Blockly.Block) {
      const mode = block.getFieldValue('MODE'); // 'SPLIT', 'JOIN', or 'PARSE'
      
      // Get text input or list
      const inputBlock = block.getInputTargetBlock('INPUT');
      let input = null;
      if (inputBlock) {
        input = javascriptGenerator.blockToHighLevel(inputBlock);
      }
      
      // Get delimiter
      const delimBlock = block.getInputTargetBlock('DELIM');
      let delimiter = null;
      if (delimBlock) {
        delimiter = javascriptGenerator.blockToHighLevel(delimBlock);
      }
      
      return {
        type: 'lists_split',
        properties: {
          mode: mode,
          input: input,
          delimiter: delimiter
        }
      };
    };
  }
  
  // list_create - check if this block type exists first
  if (javascriptGenerator.forBlock['list_create']) {
    javascriptGenerator.forBlock['list_create'].highLevel = function(block: Blockly.Block) {
      const data = block.getFieldValue('DATA') || '';
      const items = data.split(',').map((item: string) => item.trim());
      
      return {
        type: 'list_create',
        properties: {
          items: items.map((item: string) => ({
            type: 'text',
            properties: {
              value: item
            }
          }))
        }
      };
    };
  }
  
  // list_operation - check if this block type exists first
  if (javascriptGenerator.forBlock['list_operation']) {
    javascriptGenerator.forBlock['list_operation'].highLevel = function(block: Blockly.Block) {
      const operation = block.getFieldValue('OPERATION');
      
      // Get list
      const listBlock = block.getInputTargetBlock('LIST');
      let list = null;
      if (listBlock) {
        list = javascriptGenerator.blockToHighLevel(listBlock);
      }
      
      // Get index if present
      const indexBlock = block.getInputTargetBlock('INDEX');
      let index = null;
      if (indexBlock) {
        index = javascriptGenerator.blockToHighLevel(indexBlock);
      }
      
      // Get item if present
      const itemBlock = block.getInputTargetBlock('ITEM');
      let item = null;
      if (itemBlock) {
        item = javascriptGenerator.blockToHighLevel(itemBlock);
      }
      
      return {
        type: 'list_operation',
        properties: {
          operation: operation,
          list: list,
          index: index,
          item: item
        }
      };
    };
  }
  
  // list_query - check if this block type exists first
  if (javascriptGenerator.forBlock['list_query']) {
    javascriptGenerator.forBlock['list_query'].highLevel = function(block: Blockly.Block) {
      const query = block.getFieldValue('QUERY');
      
      // Get list
      const listBlock = block.getInputTargetBlock('LIST');
      let list = null;
      if (listBlock) {
        list = javascriptGenerator.blockToHighLevel(listBlock);
      }
      
      // Get item if present (for queries like 'indexOf')
      const itemBlock = block.getInputTargetBlock('ITEM');
      let item = null;
      if (itemBlock) {
        item = javascriptGenerator.blockToHighLevel(itemBlock);
      }
      
      return {
        type: 'list_query',
        properties: {
          query: query,
          list: list,
          item: item
        }
      };
    };
  }
  
  // list_join - check if this block type exists first
  if (javascriptGenerator.forBlock['list_join']) {
    javascriptGenerator.forBlock['list_join'].highLevel = function(block: Blockly.Block) {
      const separator = block.getFieldValue('SEPARATOR');
      
      // Get list
      const listBlock = block.getInputTargetBlock('LIST');
      let list = null;
      if (listBlock) {
        list = javascriptGenerator.blockToHighLevel(listBlock);
      }
      
      return {
        type: 'list_join',
        properties: {
          separator: separator,
          list: list
        }
      };
    };
  }
  
  // list_sort - check if this block type exists first
  if (javascriptGenerator.forBlock['list_sort']) {
    javascriptGenerator.forBlock['list_sort'].highLevel = function(block: Blockly.Block) {
      const order = block.getFieldValue('ORDER');
      
      // Get list
      const listBlock = block.getInputTargetBlock('LIST');
      let list = null;
      if (listBlock) {
        list = javascriptGenerator.blockToHighLevel(listBlock);
      }
      
      return {
        type: 'list_sort',
        properties: {
          order: order,
          list: list
        }
      };
    };
  }
}

// ===== Function/Procedure Blocks =====
function registerFunctionBlockGenerators() {
  // Function definition without return value
  if (javascriptGenerator.forBlock['procedures_defnoreturn']) {
    javascriptGenerator.forBlock['procedures_defnoreturn'].highLevel = function(block: Blockly.Block) {
      const funcName = javascriptGenerator.nameDB_!.getName(
        block.getFieldValue('NAME'),
        Blockly.Names.NameType.PROCEDURE
      );
      
      // Get arguments
      const args: string[] = [];
      for (let i = 0; i < (block as any).arguments_.length; i++) {
        args.push(javascriptGenerator.nameDB_!.getName(
          (block as any).arguments_[i],
          Blockly.Names.NameType.VARIABLE
        ));
      }
      
      // Get function body statements
      const statements: any[] = [];
      let bodyBlock = block.getInputTargetBlock('STACK');
      while (bodyBlock) {
        const statement = javascriptGenerator.blockToHighLevel(bodyBlock);
        if (statement) statements.push(statement);
        bodyBlock = bodyBlock.getNextBlock();
      }
      
      return {
        type: 'function_definition',
        properties: {
          name: funcName,
          arguments: args,
          hasReturn: false,
          body: statements
        }
      };
    };
  }
  
  // Function definition with return value
  if (javascriptGenerator.forBlock['procedures_defreturn']) {
    javascriptGenerator.forBlock['procedures_defreturn'].highLevel = function(block: Blockly.Block) {
      const funcName = javascriptGenerator.nameDB_!.getName(
        block.getFieldValue('NAME'),
        Blockly.Names.NameType.PROCEDURE
      );
      
      // Get arguments
      const args: string[] = [];
      for (let i = 0; i < (block as any).arguments_.length; i++) {
        args.push(javascriptGenerator.nameDB_!.getName(
          (block as any).arguments_[i],
          Blockly.Names.NameType.VARIABLE
        ));
      }
      
      // Get function body statements
      const statements: any[] = [];
      let bodyBlock = block.getInputTargetBlock('STACK');
      while (bodyBlock) {
        const statement = javascriptGenerator.blockToHighLevel(bodyBlock);
        if (statement) statements.push(statement);
        bodyBlock = bodyBlock.getNextBlock();
      }
      
      // Get return value
      const returnBlock = block.getInputTargetBlock('RETURN');
      let returnValue = null;
      if (returnBlock) {
        returnValue = javascriptGenerator.blockToHighLevel(returnBlock);
      }
      
      return {
        type: 'function_definition',
        properties: {
          name: funcName,
          arguments: args,
          hasReturn: true,
          body: statements,
          returnValue: returnValue
        }
      };
    };
  }
  
  // Function call without return value
  if (javascriptGenerator.forBlock['procedures_callnoreturn']) {
    javascriptGenerator.forBlock['procedures_callnoreturn'].highLevel = function(block: Blockly.Block) {
      const funcName = javascriptGenerator.nameDB_!.getName(
        block.getFieldValue('NAME'),
        Blockly.Names.NameType.PROCEDURE
      );
      
      // Get argument values
      const argValues: any[] = [];
      // Use type assertion to access arguments_ property
      const arguments_ = (block as any).arguments_;
      if (arguments_) {
        for (let i = 0; i < arguments_.length; i++) {
          const argBlock = block.getInputTargetBlock('ARG' + i);
          if (argBlock) {
            const argValue = javascriptGenerator.blockToHighLevel(argBlock);
            argValues.push(argValue);
          } else {
            argValues.push(null);
          }
        }
      }
      
      return {
        type: 'function_call',
        properties: {
          name: funcName,
          arguments: argValues,
          hasReturn: false
        }
      };
    };
  }
  
  // Function call with return value
  if (javascriptGenerator.forBlock['procedures_callreturn']) {
    javascriptGenerator.forBlock['procedures_callreturn'].highLevel = function(block: Blockly.Block) {
      const funcName = javascriptGenerator.nameDB_!.getName(
        block.getFieldValue('NAME'),
        Blockly.Names.NameType.PROCEDURE
      );
      
      // Get argument values
      const argValues: any[] = [];
      // Use type assertion to access arguments_ property
      const arguments_ = (block as any).arguments_;
      if (arguments_) {
        for (let i = 0; i < arguments_.length; i++) {
          const argBlock = block.getInputTargetBlock('ARG' + i);
          if (argBlock) {
            const argValue = javascriptGenerator.blockToHighLevel(argBlock);
            argValues.push(argValue);
          } else {
            argValues.push(null);
          }
        }
      }
      
      return {
        type: 'function_call',
        properties: {
          name: funcName,
          arguments: argValues,
          hasReturn: true
        }
      };
    };
  }
  
  // procedures_ifreturn
  if (javascriptGenerator.forBlock['procedures_ifreturn']) {
    javascriptGenerator.forBlock['procedures_ifreturn'].highLevel = function(block: Blockly.Block) {
      // Get condition
      const conditionBlock = block.getInputTargetBlock('CONDITION');
      let condition = null;
      if (conditionBlock) {
        condition = javascriptGenerator.blockToHighLevel(conditionBlock);
      }
      
      // Get value to return (if condition is true)
      const valueBlock = block.getInputTargetBlock('VALUE');
      let value = null;
      if (valueBlock) {
        value = javascriptGenerator.blockToHighLevel(valueBlock);
      }
      
      // Check if this is a return or a simple "break"
      const hasValue = block.getFieldValue('HAVE_VALUE') === 'TRUE';
      
      return {
        type: 'procedures_ifreturn',
        properties: {
          condition: condition,
          hasValue: hasValue,
          value: hasValue ? value : undefined
        }
      };
    };
  }
} 
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
        const code = javascriptGenerator.valueToCode(block, 'VALUE', (javascriptGenerator as any).ORDER_ASSIGNMENT);
        if (code) {
          valueRepresentation = { type: 'literal', value: code };
        }
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
import type { WorkspaceSvg } from 'blockly';
import type { ComponentNode } from './parser.js';
import { handleValueInput, createComponentBlock } from './parser.js';

type CustomBlockHandler = (
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
) => boolean;

// Map of block types to their custom handlers
const customBlockHandlers: Record<string, CustomBlockHandler> = {
    'controls_if': handleControlsIf,
    'logic_compare': handleLogicCompare,
    'variables_set': handleVariablesSet,
    'variables_get': handleVariablesGet,
    'math_arithmetic': handleMathArithmetic,
    'controls_repeat_ext': handleLoopBlock,
    'controls_whileUntil': handleLoopBlock,
    'controls_for': handleControlsFor,
    'controls_forEach': handleControlsForEach,
    'lists_create_with': handleListsCreateWith,
    // Add math block handlers
    'math_round': handleMathRound,
    'math_on_list': handleMathOnList,
    'math_constant': handleMathConstant,
    'math_modulo': handleMathModulo,
    'math_constrain': handleMathConstrain,
    'math_random_int': handleMathRandomInt,
    'math_number_property': handleMathNumberProperty,
    'math_random_float': handleMathRandomFloat,
    // Add text block handlers
    'text_join': handleTextJoin,
    'text_length': handleTextLength,
    'text_isEmpty': handleTextIsEmpty,
    'text_indexOf': handleTextIndexOf
};

/**
 * Process a block using custom handling logic if available
 * @returns true if custom handling was applied, false otherwise
 */
export function processCustomBlock(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    const handler = customBlockHandlers[block.type];
    if (handler) {
        return handler(workspace, block, component);
    }
    return false;
}

/**
 * Custom handler for controls_if blocks
 */
function handleControlsIf(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    if (!component.properties?.clauses) {
        return false;
    }
    
    try {
        const clauses = component.properties.clauses;
        const hasElse = component.properties.hasElse === true;
        
        console.log("Processing controls_if with clauses:", clauses.length);
        
        // Add mutation to handle multiple clauses and else clause if needed
        if (clauses.length > 1 || hasElse) {
            const mutation = document.createElement('mutation');
            mutation.setAttribute('elseif', String(clauses.length - 1));
            if (hasElse) {
                mutation.setAttribute('else', '1');
            }
            block.domToMutation(mutation);
        }
        
        // Process each clause (condition + statements)
        clauses.forEach((clause: any, index: number) => {
            // Handle condition for this clause
            if (clause.condition) {
                console.log(`Processing condition for clause ${index}`);
                handleValueInput(workspace, block, `IF${index}`, clause.condition);
            }
            
            // Handle statements for this clause
            if (clause.statements && Array.isArray(clause.statements) && clause.statements.length > 0) {
                console.log(`Processing ${clause.statements.length} statements for clause ${index}`);
                
                const doInput = `DO${index}`;
                let previousStatementBlock: any = null;
                
                clause.statements.forEach((statementComponent: any) => {
                    const statementBlock = createComponentBlock(
                        workspace,
                        statementComponent,
                        previousStatementBlock || block,
                        previousStatementBlock ? 'NEXT' : doInput
                    );
                    
                    if (statementBlock) {
                        previousStatementBlock = statementBlock;
                    }
                });
            }
        });
        
        // Handle ELSE statements if present
        if (hasElse && component.properties.elseStatements && 
            Array.isArray(component.properties.elseStatements) && 
            component.properties.elseStatements.length > 0) {
            
            console.log("Processing ELSE statements");
            let previousElseBlock: any = null;
            
            component.properties.elseStatements.forEach((statementComponent: any) => {
                const elseBlock = createComponentBlock(
                    workspace,
                    statementComponent,
                    previousElseBlock || block,
                    previousElseBlock ? 'NEXT' : 'ELSE'
                );
                
                if (elseBlock) {
                    previousElseBlock = elseBlock;
                }
            });
        }
        
        return true;
    } catch (e) {
        console.error("Error handling controls_if block:", e);
        return false;
    }
}

/**
 * Custom handler for logic_compare blocks
 */
function handleLogicCompare(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    if (!component.properties) {
        return false;
    }
    
    try {
        // Set operator if present
        if (component.properties.operator) {
            const opField = block.getField('OP');
            if (opField) {
                opField.setValue(component.properties.operator);
                console.log(`Set logic_compare operator to ${component.properties.operator}`);
            }
        }
        
        // Handle left input
        if (component.properties.left) {
            handleValueInput(workspace, block, 'A', component.properties.left);
        }
        
        // Handle right input
        if (component.properties.right) {
            handleValueInput(workspace, block, 'B', component.properties.right);
        }
        
        return true;
    } catch (e) {
        console.error("Error handling logic_compare block:", e);
        return false;
    }
}

/**
 * Custom handler for variables_set blocks
 */
function handleVariablesSet(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    try {
        //console.log("PROCESSING VARIABLES_SET BLOCK", component);
        
        // Always check properties first, following our standardized approach
        const variableId = component.properties?.variableId;
        const variableName = component.properties?.variableName || 'item';
        
        console.log("Variable details:", { 
            variableId, 
            variableName
        });
        
        if (variableName) {
            // First check if variable already exists in workspace by name
            let variable = workspace.getVariable(variableName);
            
            // If variable doesn't exist, create it
            if (!variable) {
                //console.log(`Creating new variable: ${variableName}`);
                // Create with original ID if possible
                try {
                    variable = workspace.createVariable(variableName, undefined, variableId);
                } catch (e) {
                    // If ID conflict, create with auto-generated ID
                    //console.log(`Could not create with specified ID, using auto ID: ${e}`);
                    variable = workspace.createVariable(variableName);
                }
            } else {
                //console.log(`Using existing variable: ${variableName} with ID: ${variable.getId()}`);
            }
            
            // Set the variable field
            const variableField = block.getField('VAR');
            
            if (variableField) {
                variableField.setValue(variable.getId());
                //console.log(`Set variable field to: ${variable.getId()}`);
            }
            
            // Handle the value input - now consistently in properties
            const valueData = component.properties?.value;
            
            if (valueData && typeof valueData === 'object') {
                //console.log("Handling value input for variable");
                // This is critical - use the VALUE input, not trying to set a field
                handleValueInput(workspace, block, 'VALUE', valueData);
            }
        } else {
            console.warn("No variable name found for variables_set block");
        }
        
        return true;
    } catch (e) {
        console.warn('Error handling variables_set block:', e);
        return false;
    }
}

/**
 * Custom handler for variables_get blocks
 */
function handleVariablesGet(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    try {
        const variableName = component.properties?.variableName || 'item';
        const variableId = component.properties?.variableId;
        
        if (variableName) {
            // Check if variable exists by name or ID
            let variable = variableId ? workspace.getVariableById(variableId) : null;
            if (!variable) {
                variable = workspace.getVariable(variableName);
            }
            
            // If variable doesn't exist, create it
            if (!variable) {
                try {
                    // Try to create with original ID if provided
                    variable = variableId ? 
                        workspace.createVariable(variableName, undefined, variableId) : 
                        workspace.createVariable(variableName);
                } catch (e) {
                    // If ID conflict, create with auto-generated ID
                    variable = workspace.createVariable(variableName);
                }
            }
            
            // Set the variable field
            const variableField = block.getField('VAR');
            if (variableField && variable) {
                variableField.setValue(variable.getId());
                console.log(`Set variables_get VAR field to: ${variable.name} (${variable.getId()})`);
            }
        }
        
        return true;
    } catch (e) {
        console.warn('Error handling variables_get block:', e);
        return false;
    }
}

/**
 * Custom handler for math_arithmetic blocks
 */
function handleMathArithmetic(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    try {
        // Set operator if present
        if (component.properties?.operator) {
            const opField = block.getField('OP');
            if (opField) {
                opField.setValue(component.properties.operator);
                console.log(`Set math_arithmetic operator to ${component.properties.operator}`);
            }
        }
        
        // Handle left input
        if (component.properties?.left) {
            handleValueInput(workspace, block, 'A', component.properties.left);
        }
        
        // Handle right input
        if (component.properties?.right) {
            handleValueInput(workspace, block, 'B', component.properties.right);
        }
        
        return true;
    } catch (e) {
        console.error("Error handling math_arithmetic block:", e);
        return false;
    }
}

/**
 * Custom handler for loop blocks (controls_repeat_ext, controls_whileUntil)
 */
function handleLoopBlock(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    try {
        // Handle specific input fields for each block type
        if (block.type === 'controls_repeat_ext') {
            // Handle TIMES input
            if (component.properties?.times) {
                handleValueInput(workspace, block, 'TIMES', component.properties.times);
            }
        } else if (block.type === 'controls_whileUntil') {
            // Set mode (WHILE/UNTIL)
            if (component.properties?.mode) {
                const modeField = block.getField('MODE');
                if (modeField) {
                    modeField.setValue(component.properties.mode);
                }
            }
            
            // Handle condition input
            if (component.properties?.condition) {
                handleValueInput(workspace, block, 'BOOL', component.properties.condition);
            }
        }
        
        // Handle statements for loop body
        if (component.properties?.statements && Array.isArray(component.properties.statements)) {
            const statementInput = 'DO';
            let previousBlock: any = null;
            
            component.properties.statements.forEach(statementComponent => {
                const statementBlock = createComponentBlock(
                    workspace, 
                    statementComponent,
                    previousBlock || block,
                    previousBlock ? 'NEXT' : statementInput
                );
                
                if (statementBlock) {
                    previousBlock = statementBlock;
                }
            });
        }
        
        return true;
    } catch (e) {
        console.error(`Error handling loop block (${block.type}):`, e);
        return false;
    }
}

/**
 * Custom handler for controls_for blocks
 */
function handleControlsFor(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    try {
        // Handle variable field
        const variableName = component.properties?.variableName || 'i';
        const variableId = component.properties?.variableId;
        
        if (variableName) {
            // Check if variable exists by name or ID
            let variable = variableId ? workspace.getVariableById(variableId) : null;
            if (!variable) {
                variable = workspace.getVariable(variableName);
            }
            
            // If variable doesn't exist, create it
            if (!variable) {
                try {
                    // Try to create with original ID if provided
                    variable = variableId ? 
                        workspace.createVariable(variableName, undefined, variableId) : 
                        workspace.createVariable(variableName);
                } catch (e) {
                    // If ID conflict, create with auto-generated ID
                    variable = workspace.createVariable(variableName);
                }
            }
            
            // Set the variable field
            const variableField = block.getField('VAR');
            if (variableField && variable) {
                variableField.setValue(variable.getId());
                console.log(`Set controls_for VAR field to: ${variable.name} (${variable.getId()})`);
            }
        }
        
        // Handle FROM input
        if (component.properties?.from) {
            handleValueInput(workspace, block, 'FROM', component.properties.from);
        }
        
        // Handle TO input
        if (component.properties?.to) {
            handleValueInput(workspace, block, 'TO', component.properties.to);
        }
        
        // Handle BY input
        if (component.properties?.by) {
            handleValueInput(workspace, block, 'BY', component.properties.by);
        }
        
        // Handle statements for loop body
        if (component.properties?.statements && Array.isArray(component.properties.statements)) {
            const statementInput = 'DO';
            let previousBlock: any = null;
            
            component.properties.statements.forEach(statementComponent => {
                const statementBlock = createComponentBlock(
                    workspace, 
                    statementComponent,
                    previousBlock || block,
                    previousBlock ? 'NEXT' : statementInput
                );
                
                if (statementBlock) {
                    previousBlock = statementBlock;
                }
            });
        }
        
        return true;
    } catch (e) {
        console.error("Error handling controls_for block:", e);
        return false;
    }
}

/**
 * Custom handler for controls_forEach blocks
 */
function handleControlsForEach(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    try {
        // Handle variable field
        const variableName = component.properties?.variableName || 'item';
        const variableId = component.properties?.variableId;
        
        if (variableName) {
            // Check if variable exists by name or ID
            let variable = variableId ? workspace.getVariableById(variableId) : null;
            if (!variable) {
                variable = workspace.getVariable(variableName);
            }
            
            // If variable doesn't exist, create it
            if (!variable) {
                try {
                    // Try to create with original ID if provided
                    variable = variableId ? 
                        workspace.createVariable(variableName, undefined, variableId) : 
                        workspace.createVariable(variableName);
                } catch (e) {
                    // If ID conflict, create with auto-generated ID
                    variable = workspace.createVariable(variableName);
                }
            }
            
            // Set the variable field
            const variableField = block.getField('VAR');
            if (variableField && variable) {
                variableField.setValue(variable.getId());
                console.log(`Set controls_forEach VAR field to: ${variable.name} (${variable.getId()})`);
            }
        }
        
        // Handle LIST input (the collection to iterate over)
        if (component.properties?.list) {
            handleValueInput(workspace, block, 'LIST', component.properties.list);
        }
        
        // Handle statements for loop body
        if (component.properties?.statements && Array.isArray(component.properties.statements)) {
            const statementInput = 'DO';
            let previousBlock: any = null;
            
            component.properties.statements.forEach(statementComponent => {
                const statementBlock = createComponentBlock(
                    workspace, 
                    statementComponent,
                    previousBlock || block,
                    previousBlock ? 'NEXT' : statementInput
                );
                
                if (statementBlock) {
                    previousBlock = statementBlock;
                }
            });
        }
        
        return true;
    } catch (e) {
        console.error("Error handling controls_forEach block:", e);
        return false;
    }
}

/**
 * Custom handler for lists_create_with blocks
 */
function handleListsCreateWith(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    try {
        // Check if items property exists
        if (!component.properties?.items || !Array.isArray(component.properties.items)) {
            return false;
        }

        const items = component.properties.items;
        console.log(`Processing lists_create_with with ${items.length} items`);
        
        // Adjust the number of inputs based on the items count
        // Create a mutation element to set the items count
        if (items.length > 0) {
            const mutation = document.createElement('mutation');
            mutation.setAttribute('items', String(items.length));
            block.domToMutation(mutation);
        }
        
        // Process each item
        items.forEach((itemComponent: any, index: number) => {
            if (itemComponent) {
                console.log(`Processing item ${index}:`, itemComponent);
                // The input names for lists_create_with are ADD0, ADD1, ADD2, etc.
                const inputName = `ADD${index}`;
                handleValueInput(workspace, block, inputName, itemComponent);
            }
        });
        
        return true;
    } catch (e) {
        console.error("Error handling lists_create_with block:", e);
        return false;
    }
}

/**
 * Custom handler for math_round blocks
 */
function handleMathRound(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    try {
        // Set the operation type (ROUND, ROUNDUP, ROUNDDOWN, ROOT, SIN, COS, etc.)
        if (component.properties?.operator) {
            const opField = block.getField('OP');
            if (opField) {
                opField.setValue(component.properties.operator);
                console.log(`Set math_round operation to ${component.properties.operator}`);
            }
        }
        
        // Handle the NUM input
        if (component.properties?.value) {
            handleValueInput(workspace, block, 'NUM', component.properties.value);
        }
        
        return true;
    } catch (e) {
        console.error("Error handling math_round block:", e);
        return false;
    }
}

/**
 * Custom handler for math_on_list blocks
 */
function handleMathOnList(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    try {
        // Set the operation type (SUM, MIN, MAX, AVERAGE, MEDIAN, etc.)
        if (component.properties?.operator) {
            const opField = block.getField('OP');
            if (opField) {
                opField.setValue(component.properties.operator);
                console.log(`Set math_on_list operation to ${component.properties.operator}`);
            }
        }
        
        // Handle the LIST input
        if (component.properties?.list) {
            handleValueInput(workspace, block, 'LIST', component.properties.list);
        }
        
        return true;
    } catch (e) {
        console.error("Error handling math_on_list block:", e);
        return false;
    }
}

/**
 * Custom handler for math_constant blocks
 */
function handleMathConstant(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    try {
        // Set the constant type (PI, E, etc.)
        if (component.properties?.constant) {
            const constantField = block.getField('CONSTANT');
            if (constantField) {
                constantField.setValue(component.properties.constant);
                console.log(`Set math_constant to ${component.properties.constant}`);
            }
        }
        
        return true;
    } catch (e) {
        console.error("Error handling math_constant block:", e);
        return false;
    }
}

/**
 * Custom handler for math_modulo blocks
 */
function handleMathModulo(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    try {
        // Handle DIVIDEND input
        if (component.properties?.dividend) {
            handleValueInput(workspace, block, 'DIVIDEND', component.properties.dividend);
        }
        
        // Handle DIVISOR input
        if (component.properties?.divisor) {
            handleValueInput(workspace, block, 'DIVISOR', component.properties.divisor);
        }
        
        return true;
    } catch (e) {
        console.error("Error handling math_modulo block:", e);
        return false;
    }
}

/**
 * Custom handler for math_constrain blocks
 */
function handleMathConstrain(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    try {
        // Handle VALUE input
        if (component.properties?.value) {
            handleValueInput(workspace, block, 'VALUE', component.properties.value);
        }
        
        // Handle LOW input
        if (component.properties?.low) {
            handleValueInput(workspace, block, 'LOW', component.properties.low);
        }
        
        // Handle HIGH input
        if (component.properties?.high) {
            handleValueInput(workspace, block, 'HIGH', component.properties.high);
        }
        
        return true;
    } catch (e) {
        console.error("Error handling math_constrain block:", e);
        return false;
    }
}

/**
 * Custom handler for math_random_int blocks
 */
function handleMathRandomInt(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    try {
        // Handle FROM input
        if (component.properties?.from) {
            handleValueInput(workspace, block, 'FROM', component.properties.from);
        }
        
        // Handle TO input
        if (component.properties?.to) {
            handleValueInput(workspace, block, 'TO', component.properties.to);
        }
        
        return true;
    } catch (e) {
        console.error("Error handling math_random_int block:", e);
        return false;
    }
}

/**
 * Custom handler for math_number_property blocks
 */
function handleMathNumberProperty(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    try {
        // Set the property type (EVEN, ODD, POSITIVE, etc.)
        if (component.properties?.property) {
            const propertyField = block.getField('PROPERTY');
            if (propertyField) {
                propertyField.setValue(component.properties.property);
                console.log(`Set math_number_property to ${component.properties.property}`);
            }
        }
        
        // Handle NUMBER input
        if (component.properties?.number) {
            handleValueInput(workspace, block, 'NUMBER_TO_CHECK', component.properties.number);
        }
        
        // Handle DIVISOR input for DIVISIBLE_BY property
        if (component.properties?.property === 'DIVISIBLE_BY' && component.properties?.divisor) {
            handleValueInput(workspace, block, 'DIVISOR', component.properties.divisor);
        }
        
        return true;
    } catch (e) {
        console.error("Error handling math_number_property block:", e);
        return false;
    }
}

/**
 * Custom handler for math_random_float blocks
 */
function handleMathRandomFloat(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    // This block doesn't need any special handling as it has no inputs or fields to set
    return true;
}

/**
 * Custom handler for text_join blocks
 */
function handleTextJoin(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    try {
        // Check if items property exists
        if (!component.properties?.items || !Array.isArray(component.properties.items)) {
            return false;
        }

        const items = component.properties.items;
        console.log(`Processing text_join with ${items.length} items`);
        
        // Adjust the number of inputs based on the items count
        // Create a mutation element to set the items count
        if (items.length > 0) {
            const mutation = document.createElement('mutation');
            mutation.setAttribute('items', String(items.length));
            block.domToMutation(mutation);
        }
        
        // Process each item
        items.forEach((itemComponent: any, index: number) => {
            if (itemComponent) {
                console.log(`Processing text item ${index}:`, itemComponent);
                // The input names for text_join are ADD0, ADD1, ADD2, etc.
                const inputName = `ADD${index}`;
                handleValueInput(workspace, block, inputName, itemComponent);
            }
        });
        
        return true;
    } catch (e) {
        console.error("Error handling text_join block:", e);
        return false;
    }
}

/**
 * Custom handler for text_length blocks
 */
function handleTextLength(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    try {
        // Handle the VALUE input
        if (component.properties?.value) {
            handleValueInput(workspace, block, 'VALUE', component.properties.value);
        }
        
        return true;
    } catch (e) {
        console.error("Error handling text_length block:", e);
        return false;
    }
}

/**
 * Custom handler for text_isEmpty blocks
 */
function handleTextIsEmpty(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    try {
        // Handle the VALUE input
        if (component.properties?.value) {
            handleValueInput(workspace, block, 'VALUE', component.properties.value);
        }
        
        return true;
    } catch (e) {
        console.error("Error handling text_isEmpty block:", e);
        return false;
    }
}

/**
 * Custom handler for text_indexOf blocks
 */
function handleTextIndexOf(
    workspace: WorkspaceSvg,
    block: any,
    component: ComponentNode
): boolean {
    try {
        // Set the operation (FIRST or LAST)
        if (component.properties?.end) {
            const endField = block.getField('END');
            if (endField) {
                endField.setValue(component.properties.end);
                console.log(`Set text_indexOf operation to ${component.properties.end}`);
            }
        }
        
        // Handle the VALUE input (text to search in)
        if (component.properties?.value) {
            handleValueInput(workspace, block, 'VALUE', component.properties.value);
        }
        
        // Handle the FIND input (text to find)
        if (component.properties?.find) {
            handleValueInput(workspace, block, 'FIND', component.properties.find);
        }
        
        return true;
    } catch (e) {
        console.error("Error handling text_indexOf block:", e);
        return false;
    }
}
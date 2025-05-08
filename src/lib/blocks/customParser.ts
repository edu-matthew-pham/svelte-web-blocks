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
    'controls_whileUntil': handleLoopBlock
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
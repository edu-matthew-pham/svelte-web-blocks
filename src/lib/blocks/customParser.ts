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
    'logic_compare': handleLogicCompare  // Add handler for logic_compare
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
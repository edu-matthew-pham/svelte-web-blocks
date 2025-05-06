import type { WorkspaceSvg } from 'blockly';
import { processCustomBlock } from './customParser.js';

export interface ComponentNode {
    type: string;
    properties?: Record<string, any>;
    children?: ComponentNode[];
    attributes?: Record<string, any>;
    styles?: ComponentNode[];
    scripts?: ComponentNode[];
    value?: string;
    onloadScripts?: ComponentNode[];
}

// Near the top of the file, add this mapping
const blockInputsMap: Record<string, Record<string, string>> = {
  'logic_compare': {
    'left': 'A',
    'right': 'B'
  },
  'console_log': {
    'value': 'TEXT'
  },
  'math_arithmetic': {
    'left': 'A',
    'right': 'B'
  }
  // Add other blocks with inputs as needed
};

export function parseHighLevelCode(jsonString: string): ComponentNode[] {
    try {
        const parsed = JSON.parse(jsonString);
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
        console.error("Error parsing high-level JSON:", error);
        return [];
    }
}

export function createBlocksFromJson(workspace: WorkspaceSvg, jsonString: string): void {
    const components = parseHighLevelCode(jsonString);
    console.log("Parsed components:", components);
    
    // Clear workspace
    workspace.clear();
    
    // Check for scripts in the top-level components
    components.forEach(component => {
        if (component.scripts && component.scripts.length > 0) {
            console.log("Found scripts array in component:", component.scripts);
        }
    });
    
    // Create blocks for each component
    components.forEach(component => {
        createComponentBlock(workspace, component);
    });
}

// Add a function to determine if a property should be skipped for a specific block type
function shouldSkipProperty(blockType: string, propertyName: string): boolean {
    // Properties that should be skipped for variables_set blocks
    if (blockType === 'variables_set') {
        return ['variableName', 'variableId', 'isDeclared', 'value'].includes(propertyName);
    }
    
    // Properties that should be skipped for all blocks
    return ['children', 'scripts', 'styles', 'onloadScripts'].includes(propertyName);
}

function createComponentBlock(
    workspace: WorkspaceSvg, 
    component: ComponentNode, 
    parentBlock?: any, 
    connectionName?: string
): any {
    if (!component.type) return null;
    
    // Map component type to block type
    const blockType = mapComponentTypeToBlockType(component.type, component);
    //console.log(`Creating block of type: ${blockType} from component type: ${component.type}`, component);
    
    try {
        // Create the block
        const block = workspace.newBlock(blockType);
        
        // Handle variable blocks
        if (component.type === 'variables_set') {
            //console.log("PROCESSING VARIABLES_SET BLOCK", component);
            try {
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
            } catch (e) {
                console.warn('Error handling variables_set block:', e);
            }
        }
        
        // Try using a custom block handler first
        const customHandled = processCustomBlock(workspace, block, component);
        
        // Only proceed with default property handling if not handled by a custom handler
        if (!customHandled && component.properties) {
            // Handle input properties first based on the inputs map
            const inputsMap = blockInputsMap[blockType];
            if (inputsMap) {
                Object.entries(inputsMap).forEach(([propName, inputName]) => {
                    if (component.properties && component.properties[propName]) {
                        handleValueInput(workspace, block, inputName, component.properties[propName]);
                    }
                });
            }
            
            // Create a filtered properties object that excludes properties already handled
            const filteredProperties = Object.fromEntries(
                Object.entries(component.properties)
                    .filter(([key, _]) => 
                        !shouldSkipProperty(blockType, key) && 
                        !(inputsMap && key in inputsMap))
            );
            
            // Only call setBlockFields if there are properties to set
            if (Object.keys(filteredProperties).length > 0) {
                setBlockFields(block, filteredProperties);
            }
        }
        
        // Handle console_log and other blocks with value property
        // Modified to look for value in properties object first
        if (component.properties?.value !== undefined && 
            blockType !== 'variables_set') { // Skip for variables_set which is handled above
            if (blockType === 'console_log') {
                // For console_log blocks specifically
                try {
                    const value = component.properties.value;
                    // If value is a simple string
                    if (typeof value === 'string') {
                        const valueInput = block.getInput('TEXT');
                        if (valueInput) {
                            // Create text shadow block
                            const textBlock = workspace.newBlock('text');
                            textBlock.initSvg();
                            
                            // Remove extra quotes if present
                            let textValue = value;
                            if (textValue.startsWith("'") && textValue.endsWith("'")) {
                                textValue = textValue.slice(1, -1);
                            }
                            
                            textBlock.setFieldValue(textValue, 'TEXT');
                            
                            // Connect to console_log
                            const connection = valueInput.connection;
                            const textConnection = textBlock.outputConnection;
                            if (connection && textConnection) {
                                connection.connect(textConnection);
                            }
                        } else {
                            // Fallback to direct field setting if no input exists
                            block.setFieldValue(value, 'TEXT');
                        }
                    } 
                    // If value is an object with nested structure
                    else if (typeof value === 'object') {
                        handleValueInput(workspace, block, 'TEXT', value);
                    }
                } catch (e) {
                    console.warn(`Could not set TEXT field for console_log:`, e);
                }
            } else {
                // General case for other blocks with value field
                try {
                    block.setFieldValue(component.properties.value, 'VALUE');
                    console.log(`Set script VALUE field to: ${component.properties.value}`);
                } catch (e) {
                    console.warn(`Could not set VALUE field for script:`, e);
                }
            }
        }
        // Fallback for direct value property (for backward compatibility)
        else if (component.value !== undefined && component.type !== 'variables_set') {
            // Same code as above but using component.value directly
            // This can eventually be removed when all high-level generators are updated
        }
        
        // Set attributes (ID, className, etc.)
        if (component.attributes) {
            const fieldValues: Record<string, any> = {};
            
            // Only add fields that exist in the attributes object
            if (component.attributes.id) {
                fieldValues.ID = component.attributes.id;
            }
            
            if (component.attributes.className) {
                fieldValues.CLASS = component.attributes.className;
            }
            
            // Add other attributes as needed
            
            // Only call setBlockFields if we have fields to set
            if (Object.keys(fieldValues).length > 0) {
                setBlockFields(block, fieldValues);
            }
        }
        
        // Initialize the block SVG first
        block.initSvg();
        
        // If this is a top-level block, position it and render it
        if (!parentBlock) {
            // Position at a reasonable location
            block.moveBy(20, 20);
            block.render();
        }
        // Otherwise connect to parent
        else if (connectionName) {
            connectToParent(block, parentBlock, connectionName);
            block.render(); // Render after connecting
        }
        
        // Process children
        if (component.children && component.children.length > 0) {
            // Find appropriate statement input for children
            const statementInput = findStatementInput(block);
            
            if (statementInput) {
                let previousBlock: any = null;
                
                component.children.forEach(childComponent => {
                    const childBlock = createComponentBlock(
                        workspace, 
                        childComponent,
                        previousBlock || block,
                        previousBlock ? 'NEXT' : statementInput
                    );
                    
                    if (childBlock) {
                        previousBlock = childBlock;
                    }
                });
            } else {
                console.warn(`No statement input found for block ${blockType} children`);
            }
        }
        
        // Special handling for function definition bodies
        if ((blockType === 'procedures_defnoreturn' || blockType === 'procedures_defreturn') && 
            component.properties?.body && Array.isArray(component.properties.body) && 
            component.properties.body.length > 0) {
            
            // Function body blocks are attached to the STACK input
            const stackInput = 'STACK';
            let previousStackBlock: any = null;
            
            component.properties.body.forEach(bodyComponent => {
                const bodyBlock = createComponentBlock(
                    workspace,
                    bodyComponent,
                    previousStackBlock || block,
                    previousStackBlock ? 'NEXT' : stackInput
                );
                
                if (bodyBlock) {
                    previousStackBlock = bodyBlock;
                }
            });
            
            // If this is a function with return, handle the return value
            if (blockType === 'procedures_defreturn' && component.properties?.returnValue) {
                const returnValue = component.properties.returnValue;
                handleValueInput(workspace, block, 'RETURN', returnValue);
            }
        }
        
        // Process styles - similar to children but using a different input name
        if (component.styles && component.styles.length > 0) {
            // Find appropriate statement input for styles
            const stylesInput = block.getInput('STYLES') ? 'STYLES' : findStatementInput(block);
            
            if (stylesInput) {
                let previousStyleBlock: any = null;
                
                component.styles.forEach(styleComponent => {
                    const styleBlock = createComponentBlock(
                        workspace, 
                        styleComponent,
                        previousStyleBlock || block,
                        previousStyleBlock ? 'NEXT' : stylesInput
                    );
                    
                    if (styleBlock) {
                        previousStyleBlock = styleBlock;
                    }
                });
            } else {
                console.warn(`No styles input found for block ${blockType} styles`);
            }
        }
        
        // Process scripts - similar to styles
        if (component.scripts && component.scripts.length > 0) {
            // Find appropriate statement input for scripts
            const scriptsInput = block.getInput('SCRIPTS') ? 'SCRIPTS' : findStatementInput(block);
            
            if (scriptsInput) {
                let previousScriptBlock: any = null;
                
                component.scripts.forEach(scriptComponent => {
                    const scriptBlock = createComponentBlock(
                        workspace, 
                        scriptComponent,
                        previousScriptBlock || block,
                        previousScriptBlock ? 'NEXT' : scriptsInput
                    );
                    
                    if (scriptBlock) {
                        previousScriptBlock = scriptBlock;
                    }
                });
            } else {
                console.warn(`No scripts input found for block ${blockType} scripts`);
            }
        }
        
        // Process onloadScripts - scripts that run when page loads
        if (component.onloadScripts && component.onloadScripts.length > 0) {
            // Find appropriate statement input for onload scripts
            const onloadInput = block.getInput('ONLOAD_SCRIPTS') ? 'ONLOAD_SCRIPTS' : 
                               (block.getInput('ONLOAD') ? 'ONLOAD' : findStatementInput(block));
            
            if (onloadInput) {
                let previousOnloadBlock: any = null;
                
                component.onloadScripts.forEach(onloadScript => {
                    const onloadBlock = createComponentBlock(
                        workspace, 
                        onloadScript,
                        previousOnloadBlock || block,
                        previousOnloadBlock ? 'NEXT' : onloadInput
                    );
                    
                    if (onloadBlock) {
                        previousOnloadBlock = onloadBlock;
                    }
                });
            } else {
                console.warn(`No onload scripts input found for block ${blockType} onloadScripts`);
            }
        }
        
        // Special handling for event handler blocks
        if (blockType === 'js_event_handler' && component.properties && component.properties.handler && 
            Array.isArray(component.properties.handler) && component.properties.handler.length > 0) {
            
            // Find the HANDLER input
            const handlerInput = block.getInput('HANDLER');
            
            if (handlerInput) {
                let previousHandlerBlock: any = null;
                
                component.properties.handler.forEach(handlerComponent => {
                    const handlerBlock = createComponentBlock(
                        workspace, 
                        handlerComponent,
                        previousHandlerBlock || block,
                        previousHandlerBlock ? 'NEXT' : 'HANDLER'
                    );
                    
                    if (handlerBlock) {
                        previousHandlerBlock = handlerBlock;
                    }
                });
            } else {
                console.warn(`No HANDLER input found for event handler block`);
            }
        }
        
        // Force a workspace render after all children are added
        if (!parentBlock) {
            workspace.render();
        }
        
        return block;
    } catch (error) {
        console.error(`Error creating block type ${blockType}:`, error);
        return null;
    }
}

// Define an enum for built-in Blockly blocks
enum BuiltinBlocklyBlocks {
    VARIABLES_SET = 'variables_set',
    VARIABLES_GET = 'variables_get',
    MATH_NUMBER = 'math_number',
    TEXT = 'text',
    VARIABLES_SET_WITH_KEY = 'variables_set_with_key',
    LOGIC_BOOLEAN = 'logic_boolean',
    CONTROLS_IF = 'controls_if',
    CONTROLS_REPEAT_EXT = 'controls_repeat_ext',
    LOGIC_COMPARE = 'logic_compare',
    LOGIC_OPERATION = 'logic_operation',
    LISTS_CREATE_WITH = 'lists_create_with',
    PROCEDURES_DEFNORETURN = 'procedures_defnoreturn',
    PROCEDURES_CALLNORETURN = 'procedures_callnoreturn',
    PROCEDURES_DEFRETURN = 'procedures_defreturn',
    PROCEDURES_CALLRETURN = 'procedures_callreturn',
    PROCEDURES_RETURN = 'procedures_return'
}

function mapComponentTypeToBlockType(componentType: string, component?: ComponentNode): string {
    // Special case for function definitions
    if (componentType === 'function_definition' && component) {
        // Check if this function has a return value
        const hasReturn = component.properties?.hasReturn === true;
        return hasReturn ? 'procedures_defreturn' : 'procedures_defnoreturn';
    }
    
    // Special case for function calls
    if (componentType === 'function_call' && component) {
        // Check if this function call returns a value
        const hasReturn = component.properties?.hasReturn === true;
        return hasReturn ? 'procedures_callreturn' : 'procedures_callnoreturn';
    }
    
    // Check if this is a built-in Blockly block
    const builtinBlocks = Object.values(BuiltinBlocklyBlocks);
    if (builtinBlocks.includes(componentType as any)) {
        return componentType;
    }
    
    // Define mappings only for types that need transformation
    const typeMap: Record<string, string> = {
        'header': 'web_header',
        'nav_item': 'web_nav_item',
        'hero': 'web_hero',
        'feature_card': 'web_feature_card',
        'feature_cards': 'web_feature_cards',
        'content_section': 'web_content_section',
        'content_block': 'web_content_block',
        'document': 'web_document',
        'form': 'web_basic_form',
        'form_field': 'web_form_field',
        'footer': 'web_footer',
        'footer_link': 'web_footer_link',
        'dynamic_cards': 'web_dynamic_cards',
        'image_gallery': 'web_image_gallery',
        'accordion': 'web_accordion',
        'create_container': 'js_create_container',
        'create_interactive': 'js_create_interactive',
        'create_text': 'js_create_text',
        'create_structured': 'js_create_structured',
        'create_structured_item': 'js_create_structured_item',
        'dom_create': 'js_create_element',
        'dom_tree': 'js_tree_operation',
        'dom_iterate': 'js_iterate_data',
        'dom_table': 'js_populate_table',
        'dom_template': 'js_create_from_template',
        // Add DOM component mappings
        'dom_select': 'js_select_element',
        'dom_property': 'js_element_property',
        'dom_class': 'js_element_class',
        'dom_event': 'js_event_handler',
        'dom_modify': 'js_modify_element',
        'dom_delete': 'js_delete_element',
        'dom_clone': 'js_clone_element'
    };
    
    // No transformation needed for CSS and script components
    if (componentType.startsWith('css_') || 
        componentType.startsWith('js_') ||
        ['console_log', 'alert', 'fetch_data'].includes(componentType)) {
        return componentType;
    }
    
    // Return mapped type or use the original as fallback
    return typeMap[componentType] || componentType;
}

function setBlockFields(block: any, properties: Record<string, any>): void {
    if (block.type === 'web_form_field') {
        console.log(`DEBUG FORM FIELD - Properties:`, properties);
        console.log(`DEBUG FORM FIELD - Available fields:`, 
            block.inputList
                .filter((input: any) => input.fieldRow && input.fieldRow.length > 0)
                .flatMap((input: any) => input.fieldRow.map((field: any) => ({
                    name: field.name,
                    type: field.constructor.name,
                    visible: field.isVisible()
                })))
        );
    }
    // Debug: Log available fields on the block
    console.log(`Available fields on ${block.type}:`, 
        block.inputList
            .filter((input: any) => input.fieldRow && input.fieldRow.length > 0)
            .flatMap((input: any) => input.fieldRow.map((field: any) => field.name))
    );
    
    Object.entries(properties).forEach(([key, value]) => {
        // Skip properties that are known not to be fields
        if (shouldSkipProperty(block.type, key)) {
            return;
        }
        
        // Special handling for form field types
        if (block.type === 'web_form_field' && key === 'fieldType') {
            try {
                block.setFieldValue(value, 'TYPE');
                console.log(`Set form field TYPE to ${value}`);
                return; // Skip other variations for this property
            } catch (e) {
                console.warn(`Could not set form field TYPE:`, e);
                // Continue to regular field setting below
            }
        }
        
        // Special handling for JSON data in dynamic content blocks
        if ((key === 'data' || key === 'images') && 
            (block.type === 'web_dynamic_cards' || 
             block.type === 'web_image_gallery' || 
             block.type === 'web_accordion')) {
            
            // Format JSON data properly for display in the block
            const jsonValue = typeof value === 'string' 
                ? value  // Already a string, assume it's formatted JSON
                : JSON.stringify(value, null, 2);  // Pretty-print JSON
                
            // Try setting with uppercase field name
            try {
                block.setFieldValue(jsonValue, key.toUpperCase());
                console.log(`Set JSON field ${key.toUpperCase()} with formatted data`);
                return; // Skip other field name variations for this property
            } catch (e) {
                console.warn(`Could not set JSON field ${key.toUpperCase()}:`, e);
                // Continue to regular field setting below
            }
        }
        
        // Try different field name variations
        const fieldVariations = [
            key,                                        // original (camelCase)
            key.toUpperCase(),                          // UPPERCASE
            key.toLowerCase(),                          // lowercase
            key.charAt(0).toUpperCase() + key.slice(1),  // PascalCase
            key.replace(/([A-Z])/g, '_$1').toUpperCase(), // LOGO_TEXT from logoText
            key.replace(/Json$/, '').toUpperCase(),     // Remove Json suffix and uppercase
            // Add other variations as needed
        ];
        
        let fieldSet = false;
        
        for (const fieldName of fieldVariations) {
            try {
                const stringValue = typeof value === 'boolean' 
                    ? (value ? 'TRUE' : 'FALSE') 
                    : String(value);
                
                block.setFieldValue(stringValue, fieldName);
                console.log(`Set field ${fieldName} = ${value}`);
                fieldSet = true;
                break;
            } catch (e) {
                // Continue trying other variations
            }
        }
        
        if (!fieldSet && 
            !((block.type === 'text_multiline_js' && 
              (key === 'value' || key === 'lineCount')) || 
             (block.type === 'console_log' && key === 'value'))) {
            console.warn(`Could not set any field for property "${key}" with value "${value}" on block ${block.type}`);
        }
    });
}

function findStatementInput(block: any): string | null {
    // Log all inputs to debug with more details
    console.log(`Block ${block.type} inputs:`, block.inputList.map((i: any) => ({
        name: i.name,
        type: i.type,
        connection: !!i.connection
    })));
    
    // Special case for CSS blocks
    if (block.type === 'css_selector') {
        // CSS selectors typically have DECLARATIONS or PROPERTIES input for their CSS properties
        const cssInputs = ['DECLARATIONS', 'PROPERTIES', 'RULES', 'STYLES', 'CONTENT'];
        
        for (const inputName of cssInputs) {
            if (block.getInput(inputName)) {
                console.log(`Found CSS input ${inputName} on block ${block.type}`);
                return inputName;
            }
        }
        
        // If no named input found, look for any statement input
        const statementInputs = block.inputList.filter((input: any) => 
            input.type === 1 && input.connection);
            
        if (statementInputs.length > 0) {
            console.log(`Found statement input ${statementInputs[0].name} for CSS rules`);
            return statementInputs[0].name;
        }
    }
    
    // Special case for script blocks
    if (block.type.startsWith('js_') || 
       ['console_log', 'alert', 'fetch_data'].includes(block.type)) {
        
        // Script blocks might use DO, THEN, ELSE for code statements
        const scriptInputs = ['DO', 'THEN', 'ELSE', 'BODY', 'CODE'];
        
        for (const inputName of scriptInputs) {
            if (block.getInput(inputName)) {
                console.log(`Found script input ${inputName} on block ${block.type}`);
                return inputName;
            }
        }
    }
    
    // Special case for forms - they should use FIELDS for form fields
    if (block.type === 'web_basic_form') {
        // Check if there's a FIELDS input
        if (block.getInput('FIELDS')) {
            return 'FIELDS';
        }
    }
    
    // Common statement input names
    const commonInputs = ['CHILDREN', 'ITEMS', 'CONTENT', 'LINKS', 'STATEMENTS', 'CARDS', 'CONTENT_BLOCKS', 'FIELDS'];
    
    // First look for inputs that exist on the block
    for (const inputName of commonInputs) {
        if (block.getInput(inputName)) {
            console.log(`Found input ${inputName} on block ${block.type}`);
            return inputName;
        }
    }
    
    // If not found, look at all inputs
    const inputs = block.inputList || [];
    for (const input of inputs) {
        if (input.type === 1) { // Statement input type
            console.log(`Found statement input ${input.name} on block ${block.type}`);
            return input.name;
        }
    }
    
    console.warn(`No statement input found on block ${block.type}`);
    return null;
}

function connectToParent(childBlock: any, parentBlock: any, connectionName: string): void {
    try {
        console.log(`Connecting child ${childBlock.type} to parent ${parentBlock.type} via ${connectionName}`);
        
        if (connectionName === 'NEXT') {
            // Connect in sequence with previous block
            if (parentBlock.nextConnection && childBlock.previousConnection) {
                console.log(`Connecting via next/previous connection`);
                parentBlock.nextConnection.connect(childBlock.previousConnection);
            } else {
                console.warn(`Missing connections for NEXT: parent.next=${!!parentBlock.nextConnection}, child.previous=${!!childBlock.previousConnection}`);
            }
        } else {
            // Connect to parent's statement input
            const parentInput = parentBlock.getInput(connectionName);
            const parentConnection = parentInput?.connection;
            
            console.log(`Parent input ${connectionName}:`, parentInput ? 'found' : 'missing');
            console.log(`Parent connection:`, parentConnection ? 'found' : 'missing');
            console.log(`Child previous connection:`, childBlock.previousConnection ? 'found' : 'missing');
            
            if (parentConnection && childBlock.previousConnection) {
                console.log(`Connecting to statement input ${connectionName}`);
                parentConnection.connect(childBlock.previousConnection);
            } else {
                console.warn(`Failed to connect: parentConnection=${!!parentConnection}, childBlock.previousConnection=${!!childBlock.previousConnection}`);
            }
        }
    } catch (e) {
        console.warn(`Failed to connect block to parent: ${e}`);
    }
}

function handleValueInput(workspace: WorkspaceSvg, block: any, inputName: string, valueData: any): void {
    try {
        console.log(`Handling value input for ${block.type}, input: ${inputName}`, valueData);
        
        if (!valueData || !valueData.type) {
            console.warn('Invalid value data object', valueData);
            return;
        }
        
        const input = block.getInput(inputName);
        if (!input || !input.connection) {
            console.warn(`Block ${block.type} has no input named ${inputName} or it has no connection`);
            return;
        }
        
        // Create value block based on its type
        const valueBlock = workspace.newBlock(valueData.type);
        valueBlock.initSvg();
        
        // Handle input properties first based on the inputs map
        const inputsMap = blockInputsMap[valueData.type];
        if (valueData.properties && inputsMap) {
            Object.entries(inputsMap).forEach(([propName, blockInputName]) => {
                if (valueData.properties[propName]) {
                    handleValueInput(workspace, valueBlock, blockInputName, valueData.properties[propName]);
                }
            });
        }
        
        // Set field values from properties if specified (only for properties not handled as inputs)
        if (valueData.properties) {
            // Create filtered properties - exclude input properties
            const filteredProperties = Object.fromEntries(
                Object.entries(valueData.properties)
                    .filter(([key, _]) => 
                        !shouldSkipProperty(valueData.type, key) && 
                        !(inputsMap && key in inputsMap))
            );
            
            // For text blocks, use TEXT field
            if (valueData.type === 'text' && filteredProperties.value !== undefined) {
                valueBlock.setFieldValue(String(filteredProperties.value), 'TEXT');
                console.log(`Set text value to: ${filteredProperties.value}`);
            }
            // For number blocks, use NUM field
            else if (valueData.type === 'math_number' && filteredProperties.value !== undefined) {
                valueBlock.setFieldValue(String(filteredProperties.value), 'NUM');
                console.log(`Set number value to: ${filteredProperties.value}`);
            }
            // For boolean blocks, use BOOL field
            else if (valueData.type === 'logic_boolean' && filteredProperties.value !== undefined) {
                valueBlock.setFieldValue(
                    filteredProperties.value === true || filteredProperties.value === 'TRUE' ? 'TRUE' : 'FALSE', 
                    'BOOL'
                );
                console.log(`Set boolean value to: ${filteredProperties.value}`);
            }
            // For other blocks, try to set remaining fields
            else if (Object.keys(filteredProperties).length > 0) {
                setBlockFields(valueBlock, filteredProperties);
            }
        }
        // Backward compatibility: direct value property
        else if (valueData.value !== undefined) {
            const fieldName = valueData.type === 'math_number' ? 'NUM' : 
                             valueData.type === 'logic_boolean' ? 'BOOL' : 'TEXT';
            valueBlock.setFieldValue(String(valueData.value), fieldName);
            console.log(`Set ${valueData.type} value to: ${valueData.value} using field ${fieldName}`);
        }
        
        // Connect to parent block
        const blockConnection = input.connection;
        const valueConnection = valueBlock.outputConnection;
        
        if (blockConnection && valueConnection) {
            blockConnection.connect(valueConnection);
            console.log(`Connected ${valueData.type} block to ${block.type}'s ${inputName} input`);
        } else {
            console.warn(`Failed to connect: blockConnection=${!!blockConnection}, valueConnection=${!!valueConnection}`);
        }
    } catch (e) {
        console.error(`Error handling value input:`, e);
    }
}

// Export these functions so they can be used in customParser.ts
export {
    handleValueInput,
    createComponentBlock
};

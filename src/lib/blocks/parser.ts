import type { WorkspaceSvg } from 'blockly';

export interface ComponentNode {
    type: string;
    properties?: Record<string, any>;
    children?: ComponentNode[];
    attributes?: Record<string, any>;
}

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
    
    // Create blocks for each component
    components.forEach(component => {
        createComponentBlock(workspace, component);
    });
}

function createComponentBlock(
    workspace: WorkspaceSvg, 
    component: ComponentNode, 
    parentBlock?: any, 
    connectionName?: string
): any {
    if (!component.type) return null;
    
    // Map component type to block type
    const blockType = mapComponentTypeToBlockType(component.type);
    console.log(`Creating block of type: ${blockType} from component type: ${component.type}`);
    
    try {
        // Create the block
        const block = workspace.newBlock(blockType);
        
        // Set properties
        if (component.properties) {
            setBlockFields(block, component.properties);
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

function mapComponentTypeToBlockType(componentType: string): string {
    // Define mappings for component types to block types
    const typeMap: Record<string, string> = {
        'header': 'web_header',
        'navItem': 'web_nav_item',
        'hero': 'web_hero',
        'featureCard': 'web_feature_card',
        'featureCards': 'web_feature_cards',
        'contentSection': 'web_content_section',
        'contentBlock': 'web_content_block',
        'document': 'web_document',
        'form': 'web_basic_form',
        'formField': 'web_form_field',
        'footer': 'web_footer',
        'footerLink': 'web_footer_link',
        // Add mappings for dynamic components
        'dynamicCards': 'web_dynamic_cards',
        'imageGallery': 'web_image_gallery',
        'accordion': 'web_accordion'
        // Add more mappings as needed
    };
    
    // Return mapped type or use web_ prefix
    return typeMap[componentType] || `web_${componentType}`;
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
        
        // Try different field name variations (original code)
        const fieldVariations = [
            key,                                        // original (camelCase)
            key.toUpperCase(),                          // UPPERCASE
            key.toLowerCase(),                          // lowercase
            key.charAt(0).toUpperCase() + key.slice(1),  // PascalCase
            // Add snake_case variation
            key.replace(/([A-Z])/g, '_$1').toUpperCase() // LOGO_TEXT from logoText
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
        
        if (!fieldSet) {
            console.warn(`Could not set any field for property "${key}" with value "${value}" on block ${block.type}`);
        }
    });
}

function findStatementInput(block: any): string | null {
    // Log all inputs to debug
    console.log(`Block ${block.type} inputs:`, block.inputList.map((i: any) => ({
        name: i.name,
        type: i.type,
        connection: !!i.connection
    })));
    
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

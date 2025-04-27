import type { WebBlockDefinitions, WebBlockConfigs } from '$lib/types.js';

/**
 * Generates JSON Schema from block definitions
 */
export function generateBlockSchemas(
  definitions: WebBlockDefinitions,
  configs?: WebBlockConfigs
): Record<string, any> {
  const schemas: Record<string, any> = {};
  
  // Process each block definition
  for (const blockType in definitions) {
    const blockDef = definitions[blockType];
    const config = configs?.[blockType];
    
    // Create schema for this block type
    schemas[blockType] = createSchemaForBlock(blockType, blockDef, config);
  }
  
  return schemas;
}

/**
 * Creates a JSON schema for a specific block
 */
function createSchemaForBlock(
  blockType: string, 
  blockDef: any,
  config?: any
): any {
  // Basic schema structure
  const schema: any = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    title: `${blockType} Block Schema`,
    description: blockDef.tooltip || `Schema for ${blockType}`,
    properties: {
      type: {
        type: "string",
        const: blockType.replace('web_', '')
      },
      properties: {
        type: "object",
        properties: {},
        required: []
      },
      attributes: {
        type: "object",
        properties: {
          id: { type: "string" },
          className: { type: "string" },
          dataAttributes: { type: "string" }
        }
      }
    },
    required: ["type", "properties"]
  };
  
  // Extract property definitions from inputs
  if (blockDef.inputsInline !== undefined) {
    processBlockInputs(blockDef, schema);
  }
  
  // Add relationship fields (children, scripts, styles)
  addRelationshipFields(schema);
  
  return schema;
}

/**
 * Process block inputs to extract property definitions
 */
function processBlockInputs(blockDef: any, schema: any): void {
  const properties = schema.properties.properties.properties;
  const required = schema.properties.properties.required;
  
  // Process each input to create property definitions
  (blockDef.inputs || []).forEach((input: any) => {
    if (input.type === "field_dropdown") {
      // Handle dropdown fields
      properties[input.name.toLowerCase()] = {
        type: "string",
        enum: input.options.map((opt: any) => opt[1])
      };
      required.push(input.name.toLowerCase());
    } 
    else if (input.type === "field_text") {
      // Handle text fields
      properties[input.name.toLowerCase()] = {
        type: "string"
      };
    }
    else if (input.type === "field_number") {
      // Handle number fields
      properties[input.name.toLowerCase()] = {
        type: "number"
      };
    }
    else if (input.type === "field_color") {
      // Handle color fields
      properties[input.name.toLowerCase()] = {
        type: "string",
        pattern: "^#[0-9A-Fa-f]{6}$"
      };
    }
    else if (input.type === "row") {
      // Process row children recursively
      if (input.children && Array.isArray(input.children)) {
        processBlockInputs({ inputs: input.children }, schema);
      }
    }
    else if (input.type === "statement") {
      // Handle statement inputs
      if (input.name === "DECLARATIONS") {
        schema.properties.styles = {
          type: "array",
          items: {
            type: "object"
          }
        };
      } else if (input.name.includes("SCRIPT")) {
        schema.properties.scripts = {
          type: "array",
          items: {
            type: "object"
          }
        };
      } else {
        schema.properties.children = {
          type: "array",
          items: {
            type: "object"
          }
        };
      }
    }
  });
}

/**
 * Add relationship fields to the schema
 */
function addRelationshipFields(schema: any): void {
  // Only add these if they don't already exist
  if (!schema.properties.children) {
    schema.properties.children = {
      type: "array",
      items: {
        type: "object"
      }
    };
  }
  
  if (!schema.properties.scripts) {
    schema.properties.scripts = {
      type: "array",
      items: {
        type: "object"
      }
    };
  }
  
  if (!schema.properties.styles) {
    schema.properties.styles = {
      type: "array",
      items: {
        type: "object"
      }
    };
  }
  
  if (!schema.properties.onloadScripts) {
    schema.properties.onloadScripts = {
      type: "array",
      items: {
        type: "object"
      }
    };
  }
} 
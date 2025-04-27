import { initializeBlocks } from '$lib/components/blocks/index.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateBlockSchemas } from './schema-extractor.js';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Extracts and saves JSON schemas for all blocks in the application
 */
export async function extractAllSchemas() {
  // Initialize all blocks to get definitions
  const { definitions } = await initializeBlocks();
  
  // Generate schemas
  const schemas = generateBlockSchemas(definitions);
  
  // Create output directory if it doesn't exist
  const outputDir = join(__dirname, '../../../schemas');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir);
  }
  
  // Save individual schemas
  for (const blockType in schemas) {
    const schema = schemas[blockType];
    const outputPath = join(outputDir, `${blockType}.json`);
    writeFileSync(outputPath, JSON.stringify(schema, null, 2));
  }
  
  // Create a combined schema with references
  const combinedSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Web Blocks Schema",
    description: "Schema for all web block components",
    type: "object",
    properties: {
      components: {
        type: "array",
        items: {
          anyOf: Object.keys(schemas).map(blockType => ({
            $ref: `#/definitions/${blockType}`
          }))
        }
      }
    },
    definitions: schemas
  };
  
  // Save combined schema
  writeFileSync(join(outputDir, 'all-blocks.json'), JSON.stringify(combinedSchema, null, 2));
  
  console.log(`Generated ${Object.keys(schemas).length} block schemas in ${outputDir}`);
}

// For ESM modules
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  extractAllSchemas().catch(console.error);
} 
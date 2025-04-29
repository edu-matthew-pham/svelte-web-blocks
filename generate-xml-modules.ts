import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// Generate TypeScript modules from XML files
async function generateXmlModules() {
  try {
    // Find all XML files in src/lib recursively
    const xmlFiles = await glob('src/lib/**/*.xml');
    console.log(`Found ${xmlFiles.length} XML files`);

    for (const xmlFile of xmlFiles) {
      // Read the XML content
      const xmlContent = fs.readFileSync(xmlFile, 'utf8');
      
      // Determine the output TypeScript file path
      const tsFilePath = xmlFile.replace('.xml', '.ts');
      
      // Generate a valid variable name from the filename
      const baseName = path.basename(xmlFile, '.xml');
      const varName = `${baseName}Xml`;
      
      // Create TypeScript content
      const tsContent = `// Auto-generated from ${path.basename(xmlFile)}
// Do not edit directly - use the XML file instead

export const ${varName} = \`${xmlContent.replace(/`/g, '\\`')}\`;
`;

      // Write the TypeScript file
      fs.writeFileSync(tsFilePath, tsContent);
      console.log(`Generated: ${tsFilePath}`);
    }

    console.log('XML module generation complete!');
  } catch (error) {
    console.error('Error generating XML modules:', error);
  }
}

// Run the function
generateXmlModules(); 
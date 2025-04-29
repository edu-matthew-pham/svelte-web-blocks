// ES Module version
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// Generate JavaScript modules from XML files
async function generateXmlModules() {
  try {
    // Find all XML files in src/lib recursively
    const xmlFiles = await glob('src/lib/**/*.xml');
    console.log(`Found ${xmlFiles.length} XML files`);

    for (const xmlFile of xmlFiles) {
      // Read the XML content
      const xmlContent = fs.readFileSync(xmlFile, 'utf8');
      
      // Determine the output JavaScript file path
      const jsFilePath = xmlFile.replace('.xml', '.js');
      
      // Generate a valid variable name from the filename
      const baseName = path.basename(xmlFile, '.xml');
      const varName = `${baseName}Xml`;
      
      // Create JavaScript content
      const jsContent = `// Auto-generated from ${path.basename(xmlFile)}
// Do not edit directly - use the XML file instead

export const ${varName} = \`${xmlContent.replace(/`/g, '\\`')}\`;
`;

      // Write the JavaScript file
      fs.writeFileSync(jsFilePath, jsContent);
      console.log(`Generated: ${jsFilePath}`);
    }

    console.log('XML module generation complete!');
  } catch (error) {
    console.error('Error generating XML modules:', error);
  }
}

// Run the function
generateXmlModules(); 
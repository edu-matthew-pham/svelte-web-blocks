import * as HTML from './htmlTemplates.js';

/**
 * Converts HTML string to Pug syntax
 * @param html HTML string to convert
 * @returns Pug syntax string
 */
export async function convertHTMLToPug(html: string): Promise<string> {
  try {
    const response = await fetch('/api/convert-to-pug', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html })
    });
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    
    const result = await response.json();
    return result.pug || '// Conversion failed';
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return '// Error: ' + errorMessage;
  }
}

// You don't need to redefine all the template functions - instead,
// you can convert the HTML output on demand when the user wants to see Pug 
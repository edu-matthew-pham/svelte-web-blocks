import fs from 'fs';
import path from 'path';

export default function xmlPlugin() {
  return {
    name: 'vite-plugin-xml',
    transform(_code: string, id: string) {
      if (id.endsWith('.xml?raw')) {
        const filePath = id.replace('?raw', '');
        const content = fs.readFileSync(filePath, 'utf-8');
        return {
          code: `export default ${JSON.stringify(content)};`,
          map: null
        };
      }
    }
  };
} 
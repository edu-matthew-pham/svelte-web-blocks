import html2pug from 'html2pug';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
  const { html } = await request.json();
  
  try {
    const pugCode = html2pug(html, { 
      fragment: true,
      commas: false,
      doubleQuotes: true
    });
    
    return json({ pug: pugCode });
  } catch (error) {
    console.error('Error converting to Pug:', error);
    return json({ 
      error: 'Conversion failed',
      pug: '// Error converting to Pug' 
    }, { status: 500 });
  }
} 
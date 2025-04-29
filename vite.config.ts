import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import xmlPlugin from './src/lib/vite-plugin-xml.js';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), xmlPlugin()]
});

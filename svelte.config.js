import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: { 
		adapter: adapter({
			// Disable symlinks in the adapter
			external: [],
			runtime: 'nodejs20.x'
			
		}) 
	}
};

export default config;

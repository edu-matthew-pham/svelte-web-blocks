<script lang="ts">
    import HtmlToPug from '$lib/examples/HtmlToPug.svelte';
    import 'prismjs/themes/prism.css';
    import { onMount } from 'svelte';
    import Prism from 'prismjs';
    import 'prismjs/components/prism-typescript';
    
    let serverCode = '';
    
    onMount(async () => {
        try {
            const response = await fetch('/code-samples/convert-to-pug.ts');
            serverCode = await response.text();
            
            // Trigger Prism to highlight the code after it's loaded
            setTimeout(() => {
                Prism.highlightAll();
            }, 0);
        } catch (error) {
            console.error('Failed to load code sample:', error);
            serverCode = '// Error loading code sample';
        }
    });
</script>

<div class="container">
    <h1>HTML to Pug Converter</h1>
    <p>
        This example demonstrates how to convert HTML code to Pug template syntax.
        The conversion is processed by a SvelteKit server route at <code><strong>api/convert-to-pug</strong><code>,
        which uses the <code><strong>html2pug</strong></code> library on the server side.
    </p>
    
    <div class="implementation-details">
        <h2>Server Route Implementation</h2>
        <pre class="language-typescript"><code>{serverCode}</code></pre>
    </div>
    
    <div class="converter-container">
        <HtmlToPug />
    </div>
</div>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }
    
    h1 {
        margin-bottom: 20px;
        font-size: 24px;
    }

    h2 {
        margin-top: 20px;
        margin-bottom: 15px;
        font-size: 20px;
    }
    
    .converter-container {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 20px;
        background-color: #fff;
    }


</style>
  
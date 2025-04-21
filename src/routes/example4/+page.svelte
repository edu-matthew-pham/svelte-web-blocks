<script lang="ts">
    import HtmlToPug from '$lib/examples/HtmlToPug.svelte';
    import 'prismjs/themes/prism.css';
</script>

<div class="container">
    <h1>HTML to Pug Converter</h1>
    <p>This example demonstrates how to convert HTML code to Pug template syntax.</p>
    
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
    
    .converter-container {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 20px;
        background-color: #fff;
    }


</style>
  
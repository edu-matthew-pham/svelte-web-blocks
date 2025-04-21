<div class="container">
	<section class="hero">
		<h1>svelte-web-blocks</h1>
		<p class="tagline">An Open Source Implementation of Utility Packages for creating Svelte Web Components using Google Blockly</p>
	</section>

	<section class="features">
		<h2>Key Features</h2>
		<div class="feature-grid">
			<div class="feature-card">
				<h3>Block-Based Editor</h3>
				<p>Create blocks visually using our intuitive block-based editor system</p>
			</div>
			<div class="feature-card">
				<h3>Customizable Templates</h3>
				<p>Use HTML to Pug conversion for flexible templating options</p>
			</div>
			<div class="feature-card">
				<h3>Extensible Architecture</h3>
				<p>Easily extend with custom blocks and generators</p>
			</div>
			<div class="feature-card">
				<h3>JSON-Powered</h3>
				<p>Create blocks from JSON definitions for maximum flexibility</p>
			</div>
		</div>
	</section>

	<section class="examples">
		<h2>Examples</h2>
		<p>Explore our examples to see what's possible with svelte-web-blocks:</p>
		<div class="example-grid">
			<a href="/example1" class="example-card">
				<h3>Example 1</h3>
				<p>Blockly to HTML</p>
			</a>
			<a href="/example2" class="example-card">
				<h3>Example 2</h3>
				<p>Blockly to JSON</p>
			</a>
			<a href="/example3" class="example-card">
				<h3>Example 3</h3>
				<p>JSON to Blocks</p>
			</a>
			<a href="/example4" class="example-card">
				<h3>Example 4</h3>
				<p>HTML to Pug</p>
			</a>
		</div>
	</section>

</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}
	
	.hero {
		text-align: center;
		padding: 3rem 0;
	}
	
	.hero h1 {
		font-size: 3rem;
		margin-bottom: 1rem;
		color: #333;
	}
	
	.tagline {
		font-size: 1.25rem;
		color: #6c757d;
		max-width: 800px;
		margin: 0 auto;
	}
	
	section {
		margin-bottom: 4rem;
	}
	
	h2 {
		font-size: 2rem;
		margin-bottom: 1.5rem;
		color: #333;
	}
	
	.feature-grid, .example-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1.5rem;
	}
	
	.feature-card, .example-card {
		background-color: #f8f9fa;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 2px 5px rgba(0,0,0,0.1);
		transition: transform 0.3s ease;
	}
	
	.example-card {
		display: block;
		text-decoration: none;
		color: inherit;
	}
	
	.feature-card:hover, .example-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 5px 15px rgba(0,0,0,0.1);
	}
	
	.feature-card h3, .example-card h3 {
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
		color: #333;
	}
	
	a {
		color: #0066cc;
		text-decoration: none;
	}
	
	a:hover {
		text-decoration: underline;
	}
</style>

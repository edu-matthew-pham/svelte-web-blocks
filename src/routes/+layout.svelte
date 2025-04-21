<script lang="ts">
	import '../app.css';


	let { children } = $props();
</script>

<header>
	<nav>
		<div class="container">
			<a href="/" class="logo">svelte-web-blocks</a>
			<ul class="nav-links">
				<li><a href="/">Home</a></li>
				<li><a href="/example1">Example 1</a></li>
				<li><a href="/example2">Example 2</a></li>
				<li><a href="/example3">Example 3</a></li>
				<li><a href="/example4">Example 4</a></li>
			</ul>
		</div>
	</nav>
</header>

<main>
	{@render children()}
</main>

<footer>
	<div class="container">
		<p>© {new Date().getFullYear()} svelte-web-clocks</p>
	</div>
</footer>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}
	
	header {
		background-color: #f8f9fa;
		border-bottom: 1px solid #e9ecef;
	}
	
	nav {
		display: flex;
		padding: 1rem 0;
	}
	
	nav .container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}
	
	.logo {
		font-weight: bold;
		font-size: 1.25rem;
		color: #333;
		text-decoration: none;
	}
	
	.nav-links {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 1.5rem;
	}
	
	.nav-links a {
		color: #333;
		text-decoration: none;
	}
	
	.nav-links a:hover {
		text-decoration: underline;
	}
	
	main {
		min-height: calc(100vh - 120px);
		padding: 2rem 0;
	}
	
	footer {
		background-color: #f8f9fa;
		border-top: 1px solid #e9ecef;
		padding: 1rem 0;
		text-align: center;
		color: #6c757d;
	}
</style>

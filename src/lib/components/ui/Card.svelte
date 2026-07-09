<script>
	/** @type {{ children?: import('svelte').Snippet }} */
	let { children } = $props();
</script>

<div class="card">
	{@render children?.()}
</div>

<style>
	.card {
		padding: 1.25rem;
		background: #ffffff;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.75rem;
		box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
	}
</style>

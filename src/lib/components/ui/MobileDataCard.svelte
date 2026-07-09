<script>
	/**
	 * @type {{
	 *   children?: import('svelte').Snippet,
	 *   actions?: import('svelte').Snippet
	 * }}
	 */
	let { children, actions } = $props();
</script>

<article class="mobile-data-card">
	<div class="mobile-data-card-body">
		{@render children?.()}
	</div>
	{#if actions}
		<div class="mobile-data-card-actions">
			{@render actions()}
		</div>
	{/if}
</article>

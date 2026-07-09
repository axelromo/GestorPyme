<script>
	/** @type {{ label: string, highlight?: boolean, children?: import('svelte').Snippet }} */
	let { label, highlight = false, children } = $props();
</script>

<div class="mobile-data-row" class:highlight>
	<span class="mobile-data-label">{label}</span>
	<span class="mobile-data-value">{@render children?.()}</span>
</div>

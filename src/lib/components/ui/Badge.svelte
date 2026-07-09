<script>
	/** @type {{ tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info', children?: import('svelte').Snippet }} */
	let { tone = 'neutral', children } = $props();
</script>

<span class="badge badge-{tone}">
	{@render children?.()}
</span>

<style>
	.badge {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.badge-neutral {
		background: #f1f5f9;
		color: #475569;
	}

	.badge-success {
		background: #dcfce7;
		color: #166534;
	}

	.badge-warning {
		background: #fef3c7;
		color: #b45309;
	}

	.badge-danger {
		background: #fee2e2;
		color: #991b1b;
	}

	.badge-info {
		background: #dbeafe;
		color: #1d4ed8;
	}
</style>

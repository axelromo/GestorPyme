<script>
	/** @type {{ tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info', children?: import('svelte').Snippet }} */
	let { tone = 'neutral', children } = $props();
</script>

<span class="badge badge-{tone}">
	{@render children?.()}
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		white-space: nowrap;
		letter-spacing: 0.01em;
	}

	.badge-neutral {
		background: #f1f5f9;
		color: #475569;
	}

	.badge-success {
		background: var(--color-success-soft);
		color: #166534;
	}

	.badge-warning {
		background: var(--color-warning-soft);
		color: #b45309;
	}

	.badge-danger {
		background: var(--color-danger-soft);
		color: #991b1b;
	}

	.badge-info {
		background: var(--color-primary-soft);
		color: #1d4ed8;
	}
</style>

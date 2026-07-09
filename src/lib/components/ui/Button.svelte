<script>
	import Spinner from '$lib/components/ui/Spinner.svelte';

	/**
	 * @type {{
	 *   type?: 'button' | 'submit',
	 *   variant?: 'primary' | 'secondary' | 'danger' | 'success',
	 *   loading?: boolean,
	 *   disabled?: boolean,
	 *   href?: string,
	 *   onclick?: (event: MouseEvent) => void,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let {
		type = 'button',
		variant = 'primary',
		loading = false,
		disabled = false,
		href = '',
		onclick,
		children
	} = $props();
</script>

{#if href}
	<a class="btn btn-{variant}" {href}>
		{@render children?.()}
	</a>
{:else}
	<button class="btn btn-{variant}" {type} disabled={disabled || loading} {onclick}>
		{#if loading}
			<Spinner size="sm" />
		{/if}
		{@render children?.()}
	</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		border-radius: var(--radius-sm);
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
		border: 1px solid transparent;
		font-family: inherit;
		white-space: nowrap;
		transition:
			background var(--transition),
			border-color var(--transition),
			box-shadow var(--transition),
			transform var(--transition);
	}

	.btn:hover:not(:disabled) {
		transform: translateY(-1px);
	}

	.btn:active:not(:disabled) {
		transform: translateY(0);
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.btn-primary {
		background: var(--color-primary);
		color: #ffffff;
	}

	.btn-primary:hover:not(:disabled) {
		background: #1d4ed8;
		box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
	}

	.btn-primary:focus-visible,
	.btn-secondary:focus-visible,
	.btn-danger:focus-visible,
	.btn-success:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	.btn-danger:focus-visible {
		outline-color: var(--color-danger);
	}

	.btn-success:focus-visible {
		outline-color: var(--color-success);
	}

	.btn-success {
		background: var(--color-success);
		color: #ffffff;
	}

	.btn-success:hover:not(:disabled) {
		background: #15803d;
		box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
	}

	.btn-secondary {
		background: var(--color-surface);
		color: var(--color-text);
		border-color: var(--color-border);
	}

	.btn-secondary:hover:not(:disabled) {
		background: var(--color-surface-hover);
		border-color: #cbd5e1;
	}

	.btn-danger {
		background: var(--color-danger);
		color: #ffffff;
	}

	.btn-danger:hover:not(:disabled) {
		background: #b91c1c;
		box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
	}
</style>

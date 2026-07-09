<script>
	import Spinner from '$lib/components/ui/Spinner.svelte';

	/**
	 * @type {{
	 *   type?: 'button' | 'submit',
	 *   variant?: 'primary' | 'secondary' | 'danger',
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
		padding: 0.625rem 1rem;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
		border: 1px solid transparent;
		font-family: inherit;
		white-space: nowrap;
	}

	.btn:disabled {
		opacity: 0.65;
		cursor: not-allowed;
	}

	.btn-primary {
		background: var(--color-primary, #2563eb);
		color: #ffffff;
	}

	.btn-secondary {
		background: #ffffff;
		color: var(--color-text, #0f172a);
		border-color: var(--color-border, #e2e8f0);
	}

	.btn-danger {
		background: #dc2626;
		color: #ffffff;
	}
</style>

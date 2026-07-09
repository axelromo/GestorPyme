<script>
	/**
	 * @type {{
	 *   action?: string,
	 *   q?: string,
	 *   placeholder?: string,
	 *   formulario?: HTMLFormElement | null,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let {
		action = '',
		q = '',
		placeholder = 'Buscar...',
		formulario = $bindable(null),
		children
	} = $props();
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let temporizador;

	function enviarConRetardo() {
		clearTimeout(temporizador);
		temporizador = setTimeout(() => {
			formulario?.requestSubmit();
		}, 350);
	}
</script>

<form bind:this={formulario} method="GET" {action} class="filters">
	<div class="search-wrap">
		<svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
		</svg>
		<input
			type="search"
			name="q"
			value={q}
			{placeholder}
			oninput={enviarConRetardo}
			aria-label={placeholder}
		/>
	</div>
	{@render children?.()}
</form>

<style>
	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-bottom: 1.25rem;
		padding: 1rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-sm);
	}

	.search-wrap {
		position: relative;
		flex: 1 1 100%;
		min-width: 0;
	}

	.search-icon {
		position: absolute;
		left: 0.875rem;
		top: 50%;
		transform: translateY(-50%);
		width: 1.125rem;
		height: 1.125rem;
		color: var(--color-text-muted);
		pointer-events: none;
	}

	.search-wrap input {
		width: 100%;
		padding-left: 2.5rem;
	}

	@media (min-width: 768px) {
		.search-wrap {
			flex: 1;
			min-width: 14rem;
		}
	}
</style>

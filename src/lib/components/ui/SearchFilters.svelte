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
	<input
		type="search"
		name="q"
		value={q}
		{placeholder}
		oninput={enviarConRetardo}
		aria-label={placeholder}
	/>
	{@render children?.()}
</form>

<style>
	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	input[type='search'],
	:global(.filters select),
	:global(.filters input[type='date']) {
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.375rem;
		font: inherit;
		background: #ffffff;
		min-width: 12rem;
	}

	input[type='search'] {
		flex: 1;
		min-width: 14rem;
	}
</style>

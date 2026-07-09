<script>
	/**
	 * @type {{
	 *   titulo: string,
	 *   valor: string,
	 *   descripcion?: string,
	 *   detalle?: Array<{ etiqueta: string, valor: string | number }>
	 * }}
	 */
	let { titulo, valor, descripcion = '', detalle = [] } = $props();
</script>

<article class="card">
	<p class="card-label">{titulo}</p>
	<p class="card-value">{valor}</p>
	{#if descripcion}
		<p class="card-description">{descripcion}</p>
	{/if}
	{#if detalle.length > 0}
		<ul class="card-detail">
			{#each detalle as fila}
				<li>
					<span>{fila.etiqueta}</span>
					<strong>{fila.valor}</strong>
				</li>
			{/each}
		</ul>
	{/if}
</article>

<style>
	.card {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: 1.25rem;
		background: #ffffff;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.75rem;
		box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
		min-height: 7.5rem;
	}

	.card-label {
		margin: 0;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-text-muted, #64748b);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.card-value {
		margin: 0;
		font-size: 1.875rem;
		font-weight: 700;
		line-height: 1.1;
		color: var(--color-text, #0f172a);
	}

	.card-description {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--color-text-muted, #64748b);
	}

	.card-detail {
		margin: 0.5rem 0 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 0.35rem;
	}

	.card-detail li {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		font-size: 0.8125rem;
		color: var(--color-text-muted, #64748b);
	}

	.card-detail strong {
		color: var(--color-text, #0f172a);
		font-weight: 600;
	}
</style>

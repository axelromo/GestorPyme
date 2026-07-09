<script>
	/**
	 * @type {{
	 *   titulo: string,
	 *   valor: string,
	 *   descripcion?: string,
	 *   detalle?: Array<{ etiqueta: string, valor: string | number }>,
	 *   destacado?: boolean
	 * }}
	 */
	let { titulo, valor, descripcion = '', detalle = [], destacado = false } = $props();

	/** @type {Record<string, string>} */
	const iconos = {
		'Total clientes': 'users',
		'Total cotizaciones': 'docs',
		'Clientes activos': 'active',
		'Total cotizado': 'money',
		'Total pagado': 'paid',
		'Cartera pendiente': 'pending',
		'Cotizaciones por estado': 'chart',
		'Total facturado': 'invoice',
		'Total cobrado': 'paid',
		'Saldo pendiente': 'pending'
	};

	const tipoIcono = $derived(iconos[titulo] ?? 'chart');
</script>

<article class="card" class:destacado aria-label="{titulo}: {valor}">
	<div class="card-top">
		<div class="icon-wrap icon-{tipoIcono}" aria-hidden="true">
			{#if tipoIcono === 'users'}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/></svg>
			{:else if tipoIcono === 'docs'}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/></svg>
			{:else if tipoIcono === 'money' || tipoIcono === 'invoice'}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
			{:else if tipoIcono === 'paid'}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
			{:else if tipoIcono === 'pending'}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/></svg>
			{/if}
		</div>
		<p class="card-label">{titulo}</p>
	</div>
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
		gap: 0.375rem;
		padding: 1.125rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-card);
		box-shadow: var(--shadow-sm);
		min-height: 6rem;
		cursor: default;
		transition:
			box-shadow var(--transition-fast),
			transform var(--transition-fast),
			border-color var(--transition-fast);
	}

	.card:hover {
		box-shadow: var(--shadow-md);
		transform: translateY(-1px);
		border-color: #cbd5e1;
	}

	.card.destacado {
		border-color: #bfdbfe;
		background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%);
	}

	.card-top {
		display: flex;
		align-items: center;
		gap: 0.625rem;
	}

	.icon-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: var(--radius-sm);
		flex-shrink: 0;
	}

	.icon-wrap svg {
		width: 1.125rem;
		height: 1.125rem;
	}

	.icon-users,
	.icon-active {
		background: #eff6ff;
		color: var(--color-primary);
	}

	.icon-docs,
	.icon-chart {
		background: #f5f3ff;
		color: #7c3aed;
	}

	.icon-money,
	.icon-invoice {
		background: #ecfdf5;
		color: var(--color-success);
	}

	.icon-paid {
		background: #dcfce7;
		color: #15803d;
	}

	.icon-pending {
		background: #fff7ed;
		color: var(--color-warning);
	}

	.card-label {
		margin: 0;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		line-height: 1.3;
	}

	.card-value {
		margin: 0;
		font-size: 1.625rem;
		font-weight: 700;
		line-height: 1.15;
		color: var(--color-text);
		letter-spacing: -0.03em;
	}

	.card-description {
		margin: 0;
		font-size: 0.75rem;
		color: var(--color-text-muted);
		line-height: 1.45;
	}

	.card-detail {
		margin: 0.375rem 0 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 0.3rem;
		border-top: 1px solid var(--color-border);
		padding-top: 0.625rem;
	}

	.card-detail li {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	.card-detail strong {
		color: var(--color-text);
		font-weight: 600;
	}

	@media (max-width: 767px) {
		.card {
			padding: 1rem;
			min-height: auto;
		}

		.card-value {
			font-size: 1.5rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.card:hover {
			transform: none;
		}
	}
</style>

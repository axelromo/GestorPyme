<script>
	import { construirUrlListado } from '$lib/ui/listado.js';

	/**
	 * @type {{
	 *   pathname: string,
	 *   paginacion: { pagina: number, totalPaginas: number, total: number, desde: number, hasta: number },
	 *   params: Record<string, string | number | undefined | null>
	 * }}
	 */
	let { pathname, paginacion, params } = $props();
</script>

{#if paginacion.totalPaginas > 1}
	<nav class="pagination" aria-label="Paginación">
		<p class="info">
			Mostrando {paginacion.desde}-{paginacion.hasta} de {paginacion.total}
		</p>
		<div class="links">
			{#if paginacion.pagina > 1}
				<a href={construirUrlListado(pathname, { ...params, page: paginacion.pagina - 1 })}>
					Anterior
				</a>
			{/if}
			{#each Array.from({ length: paginacion.totalPaginas }, (_, i) => i + 1) as numero}
				<a
					href={construirUrlListado(pathname, { ...params, page: numero })}
					class:activa={numero === paginacion.pagina}
				>
					{numero}
				</a>
			{/each}
			{#if paginacion.pagina < paginacion.totalPaginas}
				<a href={construirUrlListado(pathname, { ...params, page: paginacion.pagina + 1 })}>
					Siguiente
				</a>
			{/if}
		</div>
	</nav>
{/if}

<style>
	.pagination {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-top: 1.25rem;
		padding: 0.75rem 0;
	}

	.info {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--color-text-muted);
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	a {
		display: inline-flex;
		min-width: 2.25rem;
		justify-content: center;
		align-items: center;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		color: var(--color-text);
		font-size: 0.8125rem;
		font-weight: 500;
		text-decoration: none;
		transition:
			background var(--transition),
			border-color var(--transition),
			color var(--transition);
	}

	a:hover {
		background: var(--color-surface-hover);
		border-color: #cbd5e1;
	}

	a.activa {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: #ffffff;
	}
</style>

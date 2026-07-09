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
		margin-top: 1rem;
	}

	.info {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--color-text-muted, #64748b);
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	a {
		display: inline-flex;
		min-width: 2rem;
		justify-content: center;
		padding: 0.375rem 0.625rem;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.375rem;
		background: #ffffff;
		color: var(--color-text, #0f172a);
		font-size: 0.8125rem;
		text-decoration: none;
	}

	a.activa {
		background: var(--color-primary, #2563eb);
		border-color: var(--color-primary, #2563eb);
		color: #ffffff;
	}
</style>

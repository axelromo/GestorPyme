<script>
	import { construirUrlOrden } from '$lib/ui/listado.js';

	/**
	 * @type {{
	 *   pathname: string,
	 *   columna: string,
	 *   etiqueta: string,
	 *   ordenActual: string,
	 *   direccionActual: 'asc' | 'desc',
	 *   params: Record<string, string | number | undefined | null>
	 * }}
	 */
	let { pathname, columna, etiqueta, ordenActual, direccionActual, params } = $props();

	const activa = $derived(ordenActual === columna);
	const href = $derived(
		construirUrlOrden(pathname, { ...params, orden: ordenActual, dir: direccionActual }, columna)
	);
</script>

<a class="sort-link" class:activa {href}>
	{etiqueta}
	{#if activa}
		<span class="arrow">{direccionActual === 'asc' ? '↑' : '↓'}</span>
	{/if}
</a>

<style>
	.sort-link {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: inherit;
		text-decoration: none;
		transition: color var(--transition);
	}

	.sort-link:hover {
		color: var(--color-primary);
	}

	.sort-link.activa {
		color: var(--color-primary-dark);
		font-weight: 700;
	}

	.arrow {
		font-size: 0.75rem;
		opacity: 0.85;
	}
</style>

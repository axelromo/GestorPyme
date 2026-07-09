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
		<span>{direccionActual === 'asc' ? '↑' : '↓'}</span>
	{/if}
</a>

<style>
	.sort-link {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		color: inherit;
		text-decoration: none;
	}

	.sort-link.activa {
		color: var(--color-primary, #2563eb);
	}
</style>

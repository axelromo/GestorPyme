<script>
	import { page } from '$app/state';
	import ClientesTable from '$lib/components/clientes/ClientesTable.svelte';
	import ClienteToolbar from '$lib/components/clientes/ClienteToolbar.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import ErrorCard from '$lib/components/ui/ErrorCard.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import SearchFilters from '$lib/components/ui/SearchFilters.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { obtenerMensajeExito } from '$lib/ui/mensajes.js';

	let { data } = $props();

	const mensajeExito = $derived(obtenerMensajeExito(data.exito));
	const mensajeError = $derived(
		data.error === 'cliente-con-cotizaciones'
			? 'No se puede eliminar un cliente con cotizaciones asociadas.'
			: null
	);

	const paramsListado = $derived({
		q: data.filtros.q,
		orden: data.filtros.orden,
		dir: data.filtros.dir
	});
</script>

<section class="page">
	<ClienteToolbar titulo="Clientes" botonUrl="/clientes/nuevo" />

	{#if mensajeExito}
		<Toast mensaje={mensajeExito} />
	{/if}
	{#if mensajeError}
		<ErrorCard mensaje={mensajeError} />
	{/if}

	<SearchFilters q={data.filtros.q} placeholder="Buscar por nombre, empresa o correo...">
		{#if data.filtros.q}
			<input type="hidden" name="orden" value={data.filtros.orden} />
			<input type="hidden" name="dir" value={data.filtros.dir} />
		{/if}
	</SearchFilters>

	{#if data.clientes.length === 0}
		<EmptyState
			titulo="Sin clientes"
			mensaje={data.filtros.q
				? 'No encontramos clientes con ese criterio de búsqueda.'
				: 'Aún no hay clientes registrados. Crea el primero para comenzar.'}
			icono="👥"
		/>
	{:else}
		<ClientesTable
			clientes={data.clientes}
			filtros={data.filtros}
			pathname={page.url.pathname}
			params={paramsListado}
		/>
		<Pagination pathname={page.url.pathname} paginacion={data.paginacion} params={paramsListado} />
	{/if}
</section>

<style>
	.page {
		min-width: 0;
	}
</style>

<script>
	import { page } from '$app/state';
	import PagosTable from '$lib/components/pagos/PagosTable.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import SearchFilters from '$lib/components/ui/SearchFilters.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { ETIQUETAS_METODO } from '$lib/validaciones/pago.js';
	import { obtenerMensajeExito } from '$lib/ui/mensajes.js';

	let { data } = $props();

	/** @type {HTMLFormElement | null} */
	let filtrosForm = $state(null);

	const mensajeExito = $derived(obtenerMensajeExito(data.exito));
	const paramsListado = $derived({
		q: data.filtros.q,
		metodo: data.filtros.metodo,
		orden: data.filtros.orden,
		dir: data.filtros.dir
	});

	function enviarFiltros() {
		filtrosForm?.requestSubmit();
	}
</script>

<section class="page">
	<div class="toolbar">
		<div>
			<h1>Pagos</h1>
			<p class="description">Listado de pagos registrados en el sistema.</p>
		</div>
		<Button href="/pagos/nuevo" variant="primary">+ Registrar pago</Button>
	</div>

	{#if mensajeExito}
		<Toast mensaje={mensajeExito} />
	{/if}

	<SearchFilters
		bind:formulario={filtrosForm}
		q={data.filtros.q}
		placeholder="Buscar por cliente o folio..."
	>
		<select name="metodo" value={data.filtros.metodo} onchange={enviarFiltros}>
			<option value="">Todos los métodos</option>
			{#each data.metodos as metodo}
				<option value={metodo}>{ETIQUETAS_METODO[metodo]}</option>
			{/each}
		</select>
	</SearchFilters>

	{#if data.pagos.length === 0}
		<EmptyState
			titulo="Sin pagos"
			mensaje={data.filtros.q || data.filtros.metodo
				? 'No encontramos pagos con esos filtros.'
				: 'Aún no hay pagos registrados.'}
			icono="💳"
		/>
	{:else}
		<PagosTable
			pagos={data.pagos}
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

	.toolbar {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	h1 {
		margin: 0 0 0.25rem;
		font-size: 1.5rem;
	}

	.description {
		margin: 0;
		color: var(--color-text-muted, #64748b);
		font-size: 0.875rem;
	}
</style>

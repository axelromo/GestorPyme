<script>
	import { page } from '$app/state';
	import EstadoBadge from '$lib/components/cotizaciones/EstadoBadge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import SearchFilters from '$lib/components/ui/SearchFilters.svelte';
	import TableSortLink from '$lib/components/ui/TableSortLink.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { formatearMoneda } from '$lib/cotizaciones/calculos.js';
	import { obtenerMensajeExito } from '$lib/ui/mensajes.js';

	let { data } = $props();

	/** @type {HTMLFormElement | null} */
	let filtrosForm = $state(null);

	const mensajeExito = $derived(obtenerMensajeExito(data.exito));
	const paramsListado = $derived({
		q: data.filtros.q,
		estado: data.filtros.estado,
		desde: data.filtros.desde,
		hasta: data.filtros.hasta,
		orden: data.filtros.orden,
		dir: data.filtros.dir
	});

	/**
	 * @param {string} fecha
	 */
	function formatFecha(fecha) {
		return new Date(fecha).toLocaleDateString('es-MX', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function enviarFiltros() {
		filtrosForm?.requestSubmit();
	}
</script>

<section class="page">
	<div class="toolbar">
		<div>
			<h1>Cotizaciones</h1>
			<p class="description">Listado de cotizaciones registradas en el sistema.</p>
		</div>
		<Button href="/cotizaciones/nuevo" variant="primary">+ Nueva cotización</Button>
	</div>

	{#if mensajeExito}
		<Toast mensaje={mensajeExito} />
	{/if}

	<SearchFilters
		bind:formulario={filtrosForm}
		q={data.filtros.q}
		placeholder="Buscar por folio o cliente..."
	>
		<select name="estado" value={data.filtros.estado} onchange={enviarFiltros}>
			<option value="">Todos los estados</option>
			{#each data.estados as estado}
				<option value={estado}>{estado}</option>
			{/each}
		</select>
		<input type="date" name="desde" value={data.filtros.desde} onchange={enviarFiltros} />
		<input type="date" name="hasta" value={data.filtros.hasta} onchange={enviarFiltros} />
	</SearchFilters>

	{#if data.cotizaciones.length === 0}
		<EmptyState
			titulo="Sin cotizaciones"
			mensaje={data.filtros.q || data.filtros.estado || data.filtros.desde || data.filtros.hasta
				? 'No encontramos cotizaciones con esos filtros.'
				: 'Aún no hay cotizaciones registradas.'}
			icono="📄"
		/>
	{:else}
		<div class="table-wrapper">
			<table class="table">
				<thead>
					<tr>
						<th>
							<TableSortLink
								pathname={page.url.pathname}
								columna="folio"
								etiqueta="Folio"
								ordenActual={data.filtros.orden}
								direccionActual={data.filtros.dir}
								params={paramsListado}
							/>
						</th>
						<th>
							<TableSortLink
								pathname={page.url.pathname}
								columna="cliente"
								etiqueta="Cliente"
								ordenActual={data.filtros.orden}
								direccionActual={data.filtros.dir}
								params={paramsListado}
							/>
						</th>
						<th>
							<TableSortLink
								pathname={page.url.pathname}
								columna="fecha"
								etiqueta="Fecha"
								ordenActual={data.filtros.orden}
								direccionActual={data.filtros.dir}
								params={paramsListado}
							/>
						</th>
						<th>
							<TableSortLink
								pathname={page.url.pathname}
								columna="estado"
								etiqueta="Estado"
								ordenActual={data.filtros.orden}
								direccionActual={data.filtros.dir}
								params={paramsListado}
							/>
						</th>
						<th>
							<TableSortLink
								pathname={page.url.pathname}
								columna="total"
								etiqueta="Total"
								ordenActual={data.filtros.orden}
								direccionActual={data.filtros.dir}
								params={paramsListado}
							/>
						</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					{#each data.cotizaciones as cotizacion (cotizacion.id)}
						<tr>
							<td>{cotizacion.folio}</td>
							<td>{cotizacion.clienteNombre}</td>
							<td>{formatFecha(cotizacion.fecha)}</td>
							<td><EstadoBadge estado={cotizacion.estado} /></td>
							<td>{formatearMoneda(cotizacion.total)}</td>
							<td>
								<a class="link" href="/cotizaciones/{cotizacion.id}">Ver</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
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

	.table-wrapper {
		overflow-x: auto;
		background: #ffffff;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.5rem;
	}

	.table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
		min-width: 44rem;
	}

	th,
	td {
		padding: 0.75rem 1rem;
		text-align: left;
		border-bottom: 1px solid var(--color-border, #e2e8f0);
	}

	th {
		color: var(--color-text-muted, #64748b);
		background: var(--color-sidebar, #f8fafc);
	}

	.link {
		color: var(--color-primary, #2563eb);
		font-weight: 600;
		text-decoration: none;
	}
</style>

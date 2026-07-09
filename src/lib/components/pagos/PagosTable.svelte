<script>
	import { enhance } from '$app/forms';
	import EstadoPagoBadge from '$lib/components/pagos/EstadoPagoBadge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import ModalConfirm from '$lib/components/ui/ModalConfirm.svelte';
	import TableSortLink from '$lib/components/ui/TableSortLink.svelte';
	import { ETIQUETAS_METODO } from '$lib/validaciones/pago.js';
	import { formatearMoneda } from '$lib/cotizaciones/calculos.js';

	/**
	 * @type {{
	 *   pagos: Array<{
	 *     id: string,
	 *     fecha: string,
	 *     folio: string,
	 *     clienteNombre: string,
	 *     metodo: string,
	 *     monto: number,
	 *     referencia: string | null,
	 *     estadoPago: string
	 *   }>,
	 *   filtros: { q: string, metodo: string, orden: string, dir: 'asc' | 'desc' },
	 *   pathname: string,
	 *   params: Record<string, string | number | undefined | null>
	 * }}
	 */
	let { pagos, filtros, pathname, params } = $props();

	let pagoAEliminar = $state(null);
	/** @type {HTMLFormElement | null} */
	let formularioEliminar = $state(null);

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

	/**
	 * @param {string | null} valor
	 */
	function mostrarValor(valor) {
		return valor?.trim() ? valor : '—';
	}

	/**
	 * @param {string} metodo
	 */
	function etiquetaMetodo(metodo) {
		return ETIQUETAS_METODO[metodo] ?? metodo;
	}

	function confirmarEliminar() {
		formularioEliminar?.requestSubmit();
		pagoAEliminar = null;
	}
</script>

<form
	bind:this={formularioEliminar}
	method="POST"
	action="?/eliminar"
	use:enhance
	class="hidden-form"
>
	<input type="hidden" name="id" value={pagoAEliminar?.id ?? ''} />
</form>

<ModalConfirm
	abierto={Boolean(pagoAEliminar)}
	titulo="Eliminar pago"
	mensaje="¿Deseas eliminar este pago? Se recalculará el estado de la cotización."
	confirmarTexto="Eliminar"
	peligroso={true}
	onConfirmar={confirmarEliminar}
	onCancelar={() => (pagoAEliminar = null)}
/>

<div class="table-wrapper">
	<table class="table">
		<thead>
			<tr>
				<th>
					<TableSortLink
						{pathname}
						columna="fecha"
						etiqueta="Fecha"
						ordenActual={filtros.orden}
						direccionActual={filtros.dir}
						{params}
					/>
				</th>
				<th>
					<TableSortLink
						{pathname}
						columna="folio"
						etiqueta="Cotización"
						ordenActual={filtros.orden}
						direccionActual={filtros.dir}
						{params}
					/>
				</th>
				<th>
					<TableSortLink
						{pathname}
						columna="cliente"
						etiqueta="Cliente"
						ordenActual={filtros.orden}
						direccionActual={filtros.dir}
						{params}
					/>
				</th>
				<th>
					<TableSortLink
						{pathname}
						columna="metodo"
						etiqueta="Método"
						ordenActual={filtros.orden}
						direccionActual={filtros.dir}
						{params}
					/>
				</th>
				<th>
					<TableSortLink
						{pathname}
						columna="monto"
						etiqueta="Monto"
						ordenActual={filtros.orden}
						direccionActual={filtros.dir}
						{params}
					/>
				</th>
				<th>Referencia</th>
				<th>Estado</th>
				<th>Acciones</th>
			</tr>
		</thead>
		<tbody>
			{#each pagos as pago (pago.id)}
				<tr>
					<td>{formatFecha(pago.fecha)}</td>
					<td>{pago.folio}</td>
					<td>{pago.clienteNombre}</td>
					<td>{etiquetaMetodo(pago.metodo)}</td>
					<td>{formatearMoneda(pago.monto)}</td>
					<td>{mostrarValor(pago.referencia)}</td>
					<td><EstadoPagoBadge estado={pago.estadoPago} /></td>
					<td class="acciones">
						<a class="btn-link" href="/pagos/{pago.id}/editar">Editar</a>
						<Button variant="danger" onclick={() => (pagoAEliminar = pago)}>Eliminar</Button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.hidden-form {
		display: none;
	}

	.table-wrapper {
		overflow-x: auto;
		background: var(--color-surface, #ffffff);
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.5rem;
	}

	.table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
		min-width: 52rem;
	}

	.table th,
	.table td {
		padding: 0.75rem 1rem;
		text-align: left;
		border-bottom: 1px solid var(--color-border, #e2e8f0);
	}

	.table th {
		font-weight: 600;
		color: var(--color-text-muted, #64748b);
		background: var(--color-sidebar, #f8fafc);
		white-space: nowrap;
	}

	.acciones {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		white-space: nowrap;
	}

	.btn-link {
		display: inline-flex;
		align-items: center;
		padding: 0.625rem 1rem;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.375rem;
		background: #ffffff;
		color: var(--color-primary, #2563eb);
		font-size: 0.8125rem;
		font-weight: 600;
		text-decoration: none;
	}
</style>

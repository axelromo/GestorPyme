<script>
	import { enhance } from '$app/forms';
	import EstadoPagoBadge from '$lib/components/pagos/EstadoPagoBadge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import MobileDataCard from '$lib/components/ui/MobileDataCard.svelte';
	import MobileDataRow from '$lib/components/ui/MobileDataRow.svelte';
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

<div class="table-wrapper table-desktop">
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

<div class="mobile-card-list">
	{#each pagos as pago (pago.id)}
		<MobileDataCard>
			{#snippet children()}
				<MobileDataRow label="Fecha">{formatFecha(pago.fecha)}</MobileDataRow>
				<MobileDataRow label="Cotización">{pago.folio}</MobileDataRow>
				<MobileDataRow label="Cliente">{pago.clienteNombre}</MobileDataRow>
				<MobileDataRow label="Método">{etiquetaMetodo(pago.metodo)}</MobileDataRow>
				<MobileDataRow label="Monto">{formatearMoneda(pago.monto)}</MobileDataRow>
				<MobileDataRow label="Referencia">{mostrarValor(pago.referencia)}</MobileDataRow>
				<MobileDataRow label="Estado">
					<EstadoPagoBadge estado={pago.estadoPago} />
				</MobileDataRow>
			{/snippet}
			{#snippet actions()}
				<a class="btn-link" href="/pagos/{pago.id}/editar">Editar</a>
				<Button variant="danger" onclick={() => (pagoAEliminar = pago)}>Eliminar</Button>
			{/snippet}
		</MobileDataCard>
	{/each}
</div>

<style>
	.hidden-form {
		display: none;
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
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		color: var(--color-primary);
		font-size: 0.8125rem;
		font-weight: 600;
		text-decoration: none;
		transition: background var(--transition);
	}

	.btn-link:hover {
		background: var(--color-surface-hover);
	}

	.btn-link:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	.btn-link:active {
		transform: scale(0.98);
	}
</style>

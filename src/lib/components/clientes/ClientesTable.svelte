<script>
	import { enhance } from '$app/forms';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import ModalConfirm from '$lib/components/ui/ModalConfirm.svelte';
	import TableSortLink from '$lib/components/ui/TableSortLink.svelte';

	/**
	 * @type {{
	 *   clientes: Array<{
	 *     id: string,
	 *     nombre: string,
	 *     empresa: string | null,
	 *     email: string,
	 *     telefono: string | null,
	 *     activo: boolean,
	 *     createdAt: string,
	 *     tieneCotizaciones: boolean
	 *   }>,
	 *   filtros: { q: string, orden: string, dir: 'asc' | 'desc' },
	 *   pathname: string,
	 *   params: Record<string, string | number | undefined | null>
	 * }}
	 */
	let { clientes, filtros, pathname, params } = $props();

	let clienteAEliminar = $state(null);
	let clienteADesactivar = $state(null);
	let clienteAActivar = $state(null);
	/** @type {HTMLFormElement | null} */
	let formularioEliminar = $state(null);
	/** @type {HTMLFormElement | null} */
	let formularioDesactivar = $state(null);
	/** @type {HTMLFormElement | null} */
	let formularioActivar = $state(null);

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

	function confirmarEliminar() {
		formularioEliminar?.requestSubmit();
		clienteAEliminar = null;
	}

	function confirmarDesactivar() {
		formularioDesactivar?.requestSubmit();
		clienteADesactivar = null;
	}

	function confirmarActivar() {
		formularioActivar?.requestSubmit();
		clienteAActivar = null;
	}
</script>

<form
	bind:this={formularioEliminar}
	method="POST"
	action="?/eliminar"
	use:enhance
	class="hidden-form"
>
	<input type="hidden" name="id" value={clienteAEliminar?.id ?? ''} />
</form>

<form
	bind:this={formularioDesactivar}
	method="POST"
	action="?/desactivar"
	use:enhance
	class="hidden-form"
>
	<input type="hidden" name="id" value={clienteADesactivar?.id ?? ''} />
</form>

<form
	bind:this={formularioActivar}
	method="POST"
	action="?/activar"
	use:enhance
	class="hidden-form"
>
	<input type="hidden" name="id" value={clienteAActivar?.id ?? ''} />
</form>

<ModalConfirm
	abierto={Boolean(clienteAEliminar)}
	titulo="Eliminar cliente"
	mensaje={`¿Deseas eliminar a ${clienteAEliminar?.nombre ?? 'este cliente'}? Esta acción no se puede deshacer.`}
	confirmarTexto="Eliminar"
	peligroso={true}
	onConfirmar={confirmarEliminar}
	onCancelar={() => (clienteAEliminar = null)}
/>

<ModalConfirm
	abierto={Boolean(clienteADesactivar)}
	titulo="Desactivar cliente"
	mensaje={`¿Deseas desactivar a ${clienteADesactivar?.nombre ?? 'este cliente'}? No se eliminarán sus registros.`}
	confirmarTexto="Desactivar"
	peligroso={true}
	onConfirmar={confirmarDesactivar}
	onCancelar={() => (clienteADesactivar = null)}
/>

<ModalConfirm
	abierto={Boolean(clienteAActivar)}
	titulo="Activar cliente"
	mensaje={`¿Deseas reactivar a ${clienteAActivar?.nombre ?? 'este cliente'}?`}
	confirmarTexto="Activar"
	onConfirmar={confirmarActivar}
	onCancelar={() => (clienteAActivar = null)}
/>

<div class="table-wrapper">
	<table class="table">
		<thead>
			<tr>
				<th>
					<TableSortLink
						{pathname}
						columna="nombre"
						etiqueta="Nombre"
						ordenActual={filtros.orden}
						direccionActual={filtros.dir}
						{params}
					/>
				</th>
				<th>
					<TableSortLink
						{pathname}
						columna="empresa"
						etiqueta="Empresa"
						ordenActual={filtros.orden}
						direccionActual={filtros.dir}
						{params}
					/>
				</th>
				<th>
					<TableSortLink
						{pathname}
						columna="email"
						etiqueta="Email"
						ordenActual={filtros.orden}
						direccionActual={filtros.dir}
						{params}
					/>
				</th>
				<th>Teléfono</th>
				<th>
					<TableSortLink
						{pathname}
						columna="estado"
						etiqueta="Estado"
						ordenActual={filtros.orden}
						direccionActual={filtros.dir}
						{params}
					/>
				</th>
				<th>
					<TableSortLink
						{pathname}
						columna="fecha"
						etiqueta="Fecha de creación"
						ordenActual={filtros.orden}
						direccionActual={filtros.dir}
						{params}
					/>
				</th>
				<th>Acciones</th>
			</tr>
		</thead>
		<tbody>
			{#each clientes as cliente (cliente.id)}
				<tr>
					<td>{cliente.nombre}</td>
					<td>{mostrarValor(cliente.empresa)}</td>
					<td>{cliente.email}</td>
					<td>{mostrarValor(cliente.telefono)}</td>
					<td>
						<Badge tone={cliente.activo ? 'success' : 'danger'}>
							{cliente.activo ? 'Activo' : 'Inactivo'}
						</Badge>
					</td>
					<td>{formatFecha(cliente.createdAt)}</td>
					<td class="acciones">
						<a class="btn-link" href="/clientes/{cliente.id}">Ver perfil</a>
						<a class="btn-link" href="/clientes/{cliente.id}/editar">Editar</a>
						{#if cliente.activo}
							<Button variant="secondary" onclick={() => (clienteADesactivar = cliente)}>
								Desactivar
							</Button>
						{:else}
							<Button variant="secondary" onclick={() => (clienteAActivar = cliente)}>
								Activar
							</Button>
						{/if}
						{#if !cliente.tieneCotizaciones}
							<Button variant="danger" onclick={() => (clienteAEliminar = cliente)}>Eliminar</Button>
						{/if}
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
		min-width: 48rem;
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

	.table tbody tr:last-child td {
		border-bottom: none;
	}

	.table tbody tr:hover {
		background: var(--color-surface-hover, #f8fafc);
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

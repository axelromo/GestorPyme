<script>
	import { enhance } from '$app/forms';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import ModalConfirm from '$lib/components/ui/ModalConfirm.svelte';
	import MobileDataCard from '$lib/components/ui/MobileDataCard.svelte';
	import MobileDataRow from '$lib/components/ui/MobileDataRow.svelte';
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

<div class="table-wrapper table-desktop">
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
						{#if cliente.tieneCotizaciones}
							<div class="eliminar-bloqueado">
								<span
									class="tooltip-wrap"
									title="No se puede eliminar porque el cliente tiene cotizaciones registradas."
									aria-label="No se puede eliminar porque el cliente tiene cotizaciones registradas."
								>
									<Button variant="secondary" disabled>Eliminar</Button>
									<span class="tooltip" role="tooltip">
										No se puede eliminar porque el cliente tiene cotizaciones registradas.
									</span>
								</span>
								<span class="leyenda">Cliente con historial.</span>
							</div>
						{:else}
							<Button variant="danger" onclick={() => (clienteAEliminar = cliente)}>Eliminar</Button>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<div class="mobile-card-list">
	{#each clientes as cliente (cliente.id)}
		<MobileDataCard>
			{#snippet children()}
				<MobileDataRow label="Cliente">{cliente.nombre}</MobileDataRow>
				<MobileDataRow label="Empresa">{mostrarValor(cliente.empresa)}</MobileDataRow>
				<MobileDataRow label="Correo">{cliente.email}</MobileDataRow>
				<MobileDataRow label="Estado">
					<Badge tone={cliente.activo ? 'success' : 'danger'}>
						{cliente.activo ? 'Activo' : 'Inactivo'}
					</Badge>
				</MobileDataRow>
			{/snippet}
			{#snippet actions()}
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
				{#if cliente.tieneCotizaciones}
					<div class="eliminar-bloqueado">
						<span
							class="tooltip-wrap"
							title="No se puede eliminar porque el cliente tiene cotizaciones registradas."
							aria-label="No se puede eliminar porque el cliente tiene cotizaciones registradas."
						>
							<Button variant="secondary" disabled>Eliminar</Button>
							<span class="tooltip" role="tooltip">
								No se puede eliminar porque el cliente tiene cotizaciones registradas.
							</span>
						</span>
						<span class="leyenda">Cliente con historial.</span>
					</div>
				{:else}
					<Button variant="danger" onclick={() => (clienteAEliminar = cliente)}>Eliminar</Button>
				{/if}
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
		align-items: flex-start;
		white-space: nowrap;
	}

	.eliminar-bloqueado {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.tooltip-wrap {
		position: relative;
		display: inline-flex;
	}

	.tooltip {
		position: absolute;
		bottom: calc(100% + 0.5rem);
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
		width: max-content;
		max-width: 14rem;
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius-sm);
		background: var(--color-text);
		color: #ffffff;
		font-size: 0.75rem;
		font-weight: 500;
		line-height: 1.4;
		text-align: center;
		box-shadow: var(--shadow-md);
		pointer-events: none;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity var(--transition),
			visibility var(--transition);
	}

	.tooltip::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 0.35rem solid transparent;
		border-top-color: var(--color-text);
	}

	.tooltip-wrap:hover .tooltip,
	.tooltip-wrap:focus-within .tooltip {
		opacity: 1;
		visibility: visible;
	}

	.leyenda {
		font-size: 0.6875rem;
		color: var(--color-text-muted);
		font-weight: 500;
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
		transition:
			background var(--transition),
			border-color var(--transition);
	}

	.btn-link:hover {
		background: var(--color-surface-hover);
		border-color: #cbd5e1;
	}

	.btn-link:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	.btn-link:active {
		transform: scale(0.98);
	}

	.eliminar-bloqueado {
		width: 100%;
	}
</style>

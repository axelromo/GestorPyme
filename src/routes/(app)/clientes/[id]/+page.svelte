<script>
	import DashboardCard from '$lib/components/dashboard/DashboardCard.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { formatearMoneda } from '$lib/cotizaciones/calculos.js';

	let { data } = $props();

	const cliente = $derived(data.cliente);
	const resumen = $derived(data.resumen);

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

	/** @param {string | null | undefined} valor */
	function mostrar(valor) {
		return valor?.trim() ? valor : '—';
	}
</script>

<section class="page">
	<header class="toolbar">
		<div>
			<h1>{cliente.nombre}</h1>
			<p class="description">Perfil del cliente</p>
		</div>
		<div class="toolbar-actions">
			<Badge tone={cliente.activo ? 'success' : 'danger'}>
				{cliente.activo ? 'Activo' : 'Inactivo'}
			</Badge>
			<Button href="/clientes/{cliente.id}/editar" variant="secondary">Editar</Button>
			<Button href="/clientes" variant="secondary">Regresar</Button>
		</div>
	</header>

	<div class="info-card">
		<h2>Información general</h2>
		<dl class="info-grid">
			<div><dt>Empresa</dt><dd>{mostrar(cliente.empresa)}</dd></div>
			<div><dt>Correo</dt><dd>{cliente.email}</dd></div>
			<div><dt>Teléfono</dt><dd>{mostrar(cliente.telefono)}</dd></div>
			<div><dt>RFC</dt><dd>{mostrar(cliente.rfc)}</dd></div>
			<div><dt>Dirección</dt><dd>{mostrar(cliente.direccion)}</dd></div>
			<div><dt>Registrado</dt><dd>{formatFecha(cliente.createdAt)}</dd></div>
			{#if cliente.notas?.trim()}
				<div class="full"><dt>Notas</dt><dd>{cliente.notas}</dd></div>
			{/if}
		</dl>
	</div>

	<div class="cards-grid">
		<DashboardCard titulo="Total facturado" valor={formatearMoneda(resumen.totalFacturado)} />
		<DashboardCard titulo="Total cobrado" valor={formatearMoneda(resumen.totalCobrado)} />
		<DashboardCard titulo="Saldo pendiente" valor={formatearMoneda(resumen.saldoPendiente)} />
	</div>

	<h2>Historial de cotizaciones</h2>
	{#if data.cotizaciones.length === 0}
		<EmptyState
			titulo="Sin cotizaciones"
			mensaje="Este cliente aún no tiene cotizaciones registradas."
			icono="📄"
		/>
	{:else}
		<div class="table-wrapper">
			<table class="table">
				<thead>
					<tr>
						<th>Folio</th>
						<th>Fecha</th>
						<th>Estado</th>
						<th>Total</th>
						<th>Pagado</th>
						<th>Saldo</th>
					</tr>
				</thead>
				<tbody>
					{#each data.cotizaciones as cotizacion (cotizacion.id)}
						<tr>
							<td>
								<a class="folio-link" href="/cotizaciones/{cotizacion.id}">{cotizacion.folio}</a>
							</td>
							<td>{formatFecha(cotizacion.fecha)}</td>
							<td>{cotizacion.estadoEtiqueta}</td>
							<td>{formatearMoneda(cotizacion.total)}</td>
							<td>{formatearMoneda(cotizacion.pagado)}</td>
							<td>{formatearMoneda(cotizacion.saldo)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</section>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		min-width: 0;
	}

	.toolbar {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		align-items: flex-start;
	}

	h1 {
		margin: 0 0 0.25rem;
		font-size: 1.5rem;
	}

	h2 {
		margin: 0;
		font-size: 1.125rem;
	}

	.description {
		margin: 0;
		color: var(--color-text-muted, #64748b);
		font-size: 0.875rem;
	}

	.toolbar-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		align-items: center;
	}

	.info-card {
		padding: 1rem;
		background: #ffffff;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.5rem;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		gap: 1rem;
		margin: 0;
	}

	dt {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text-muted, #64748b);
	}

	dd {
		margin: 0.25rem 0 0;
	}

	.full {
		grid-column: 1 / -1;
	}

	.cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: 1rem;
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
		min-width: 40rem;
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
	}

	.folio-link {
		color: var(--color-primary, #2563eb);
		font-weight: 600;
		text-decoration: none;
	}
</style>

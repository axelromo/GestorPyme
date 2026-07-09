<script>
	import DashboardCard from '$lib/components/dashboard/DashboardCard.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import MobileDataCard from '$lib/components/ui/MobileDataCard.svelte';
	import MobileDataRow from '$lib/components/ui/MobileDataRow.svelte';
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

	<article class="info-card saas-section-card">
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
	</article>

	<section class="saas-section-card">
		<h2>Resumen financiero</h2>
		<div class="cards-grid">
			<DashboardCard titulo="Total facturado" valor={formatearMoneda(resumen.totalFacturado)} />
			<DashboardCard titulo="Total cobrado" valor={formatearMoneda(resumen.totalCobrado)} />
			<DashboardCard
				titulo="Saldo pendiente"
				valor={formatearMoneda(resumen.saldoPendiente)}
				destacado={resumen.saldoPendiente > 0}
			/>
		</div>
	</section>

	<article class="saas-section-card">
		<h2>Historial de cotizaciones</h2>
		{#if data.cotizaciones.length === 0}
			<EmptyState
				titulo="Sin cotizaciones"
				mensaje="Este cliente aún no tiene cotizaciones registradas."
			/>
		{:else}
			<div class="table-wrapper table-desktop">
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
								<td class="saldo">{formatearMoneda(cotizacion.saldo)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="mobile-card-list">
				{#each data.cotizaciones as cotizacion (cotizacion.id)}
					<MobileDataCard>
						{#snippet children()}
							<MobileDataRow label="Folio">
								<a class="folio-link" href="/cotizaciones/{cotizacion.id}">{cotizacion.folio}</a>
							</MobileDataRow>
							<MobileDataRow label="Fecha">{formatFecha(cotizacion.fecha)}</MobileDataRow>
							<MobileDataRow label="Estado">{cotizacion.estadoEtiqueta}</MobileDataRow>
							<MobileDataRow label="Total">{formatearMoneda(cotizacion.total)}</MobileDataRow>
							<MobileDataRow label="Pagado">{formatearMoneda(cotizacion.pagado)}</MobileDataRow>
							<MobileDataRow label="Saldo" highlight={cotizacion.saldo > 0}>
								{formatearMoneda(cotizacion.saldo)}
							</MobileDataRow>
						{/snippet}
						{#snippet actions()}
							<a class="folio-link btn-link" href="/cotizaciones/{cotizacion.id}">Ver cotización</a>
						{/snippet}
					</MobileDataCard>
				{/each}
			</div>
		{/if}
	</article>
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
		font-size: 1.625rem;
		font-weight: 700;
	}

	h2 {
		margin: 0 0 1.25rem;
		font-size: 1.0625rem;
		font-weight: 600;
	}

	.description {
		margin: 0;
		color: var(--color-text-muted);
		font-size: 0.875rem;
	}

	.toolbar-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		align-items: center;
	}

	.folio-link {
		color: var(--color-primary);
		font-weight: 600;
		text-decoration: none;
	}

	.folio-link:hover {
		text-decoration: underline;
	}

	.btn-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.625rem 1rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		text-decoration: none;
	}

	.btn-link:hover {
		background: var(--color-surface-hover);
	}

	.saldo {
		font-weight: 700;
		color: var(--color-warning);
	}
</style>

<script>
	import DashboardCard from '$lib/components/dashboard/DashboardCard.svelte';
	import DashboardChart from '$lib/components/dashboard/DashboardChart.svelte';
	import DashboardList from '$lib/components/dashboard/DashboardList.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { formatearMoneda } from '$lib/cotizaciones/calculos.js';

	let { data } = $props();

	const metricas = $derived(data.metricas);
	const graficas = $derived(data.graficas);
	const detalleEstados = $derived(
		metricas.cotizacionesPorEstado.map((fila) => ({
			etiqueta: fila.etiqueta,
			valor: fila.cantidad
		}))
	);
</script>

<section class="dashboard">
	<header class="dashboard-header">
		<div>
			{#if data.nombreEmpresa}
				<p class="empresa-nombre">{data.nombreEmpresa}</p>
			{/if}
			<h1>Dashboard</h1>
			<p class="description">Resumen ejecutivo de clientes, cotizaciones y pagos.</p>
		</div>
	</header>

	{#if data.sinDatos}
		<EmptyState
			titulo="Aún no hay datos"
			mensaje="Comienza registrando tu primer cliente y creando cotizaciones para ver métricas aquí."
			icono="📊"
		/>
		<div class="empty-actions">
			<Button href="/clientes/nuevo">Registrar cliente</Button>
			<Button href="/cotizaciones/nuevo" variant="secondary">Nueva cotización</Button>
		</div>
	{:else}
		<div class="cards-grid">
			<DashboardCard titulo="Total clientes" valor={String(metricas.totalClientes)} />
			<DashboardCard titulo="Total cotizaciones" valor={String(metricas.totalCotizaciones)} />
			<DashboardCard titulo="Clientes activos" valor={String(metricas.clientesActivos)} />
			<DashboardCard
				titulo="Total cotizado"
				valor={formatearMoneda(metricas.totalCotizado)}
				descripcion="Suma de todas las cotizaciones"
			/>
			<DashboardCard
				titulo="Total pagado"
				valor={formatearMoneda(metricas.totalPagado)}
				descripcion="Pagos registrados en el sistema"
			/>
			<DashboardCard
				titulo="Cartera pendiente"
				valor={formatearMoneda(metricas.carteraPendiente)}
				descripcion="Saldo por cobrar en cotizaciones aprobadas y facturadas"
			/>
			<DashboardCard
				titulo="Cotizaciones por estado"
				valor={String(metricas.totalCotizaciones)}
				descripcion="Desglose por estado"
				detalle={detalleEstados}
			/>
		</div>

		<div class="widgets-grid">
			<DashboardList
				titulo="Últimas 5 cotizaciones"
				columnas={[
					{ clave: 'folio', etiqueta: 'Folio' },
					{ clave: 'cliente', etiqueta: 'Cliente' },
					{ clave: 'estado', etiqueta: 'Estado' },
					{ clave: 'total', etiqueta: 'Total', alineacion: 'right' }
				]}
				filas={data.widgets.ultimasCotizaciones}
			/>
			<DashboardList
				titulo="Top clientes con mayor saldo pendiente"
				columnas={[
					{ clave: 'cliente', etiqueta: 'Cliente' },
					{ clave: 'saldo', etiqueta: 'Saldo', alineacion: 'right' }
				]}
				filas={data.widgets.topClientesSaldo}
				vacio="No hay saldos pendientes por cobrar"
			/>
		</div>

		<div class="charts-grid">
			<DashboardChart
				titulo="Cotizaciones por mes"
				tipo="bar"
				labels={graficas.cotizacionesPorMes.labels}
				data={graficas.cotizacionesPorMes.data}
			/>
			<DashboardChart
				titulo="Cotizaciones por estado"
				tipo="doughnut"
				labels={graficas.cotizacionesPorEstado.labels}
				data={graficas.cotizacionesPorEstado.data}
			/>
		</div>
	{/if}
</section>

<style>
	.dashboard {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		min-width: 0;
	}

	.dashboard-header h1 {
		margin: 0 0 0.25rem;
		font-size: 1.5rem;
	}

	.empresa-nombre {
		margin: 0 0 0.25rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-primary, #2563eb);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.description {
		margin: 0;
		color: var(--color-text-muted, #64748b);
		font-size: 0.875rem;
	}

	.cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: 1rem;
	}

	.charts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
		gap: 1rem;
	}

	.widgets-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
		gap: 1rem;
	}

	.empty-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-top: -1rem;
	}

	@media (min-width: 64rem) {
		.charts-grid {
			grid-template-columns: 1.4fr 1fr;
		}
	}
</style>

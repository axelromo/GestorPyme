<script>
	import CobranzaTable from '$lib/components/cobranza/CobranzaTable.svelte';
	import DashboardCard from '$lib/components/dashboard/DashboardCard.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import ErrorCard from '$lib/components/ui/ErrorCard.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { formatearMoneda } from '$lib/cotizaciones/calculos.js';
	import { obtenerMensajeExito } from '$lib/ui/mensajes.js';

	let { data } = $props();

	const mensajeExito = $derived(obtenerMensajeExito(data.exito));
	const mensajeError = $derived(
		data.error === 'sin-saldo' ? 'Esta cotización ya no tiene saldo pendiente.' : null
	);
</script>

<section class="page">
	<header class="toolbar">
		<div>
			<h1>Cobranza</h1>
			<p class="description">
				Cotizaciones aprobadas y facturadas con saldo pendiente de cobro.
			</p>
		</div>
	</header>

	{#if mensajeExito}
		<Toast mensaje={mensajeExito} />
	{/if}
	{#if mensajeError}
		<ErrorCard titulo="No se pudo enviar" mensaje={mensajeError} />
	{/if}

	<DashboardCard
		titulo="Cartera pendiente"
		valor={formatearMoneda(data.carteraPendiente)}
		descripcion="Suma de saldos por cobrar"
		destacado={true}
	/>

	{#if data.filas.length === 0}
		<EmptyState
			titulo="Sin cuentas por cobrar"
			mensaje="No hay cotizaciones aprobadas o facturadas con saldo pendiente."
			icono="✅"
		/>
	{:else}
		<CobranzaTable filas={data.filas} />
	{/if}
</section>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		min-width: 0;
	}

	.toolbar h1 {
		margin: 0 0 0.25rem;
		font-size: 1.5rem;
	}

	.description {
		margin: 0;
		color: var(--color-text-muted, #64748b);
		font-size: 0.875rem;
	}
</style>

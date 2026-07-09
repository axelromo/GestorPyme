<script>
	import CotizacionForm from '$lib/components/cotizaciones/CotizacionForm.svelte';
	import EstadoBadge from '$lib/components/cotizaciones/EstadoBadge.svelte';

	let { data, form } = $props();
</script>

<section class="page">
	<header class="page-header">
		<h1>Editar cotización {data.folio}</h1>
		<p class="page-description">
			Estado actual: <EstadoBadge estado={data.estado} />
		</p>
	</header>

	{#if data.bloqueada}
		<div class="alert">
			<p>La cotización ya no puede modificarse.</p>
			<a class="btn-secondary" href="/cotizaciones/{data.cotizacionId}">Regresar</a>
		</div>
	{:else}
		<CotizacionForm
			{form}
			initialValues={data.initialValues}
			clientes={data.clientes}
			submitLabel="Actualizar cotización"
		/>
	{/if}
</section>

<style>
	.page-header {
		margin-bottom: 1.5rem;
	}

	.page-header h1 {
		margin: 0 0 0.25rem;
		font-size: 1.5rem;
	}

	.page-description {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-muted, #64748b);
	}

	.alert {
		padding: 1.5rem;
		background: #fff7ed;
		border: 1px solid #fed7aa;
		border-radius: 0.5rem;
	}

	.alert p {
		margin: 0 0 1rem;
		color: #9a3412;
		font-weight: 600;
	}

	.btn-secondary {
		display: inline-flex;
		padding: 0.625rem 1rem;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.375rem;
		background: #ffffff;
		text-decoration: none;
		color: var(--color-text, #0f172a);
		font-weight: 600;
	}
</style>

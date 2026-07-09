<script>
	import CotizacionForm from '$lib/components/cotizaciones/CotizacionForm.svelte';

	let { data, form } = $props();
</script>

<section class="page">
	<header class="page-header">
		<h1>Nueva cotización</h1>
		<p class="page-description">Registra una nueva cotización en el sistema.</p>
	</header>

	<CotizacionForm {form} initialValues={data.initialValues} clientes={data.clientes} />
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
</style>

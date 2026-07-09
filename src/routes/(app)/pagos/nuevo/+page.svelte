<script>
	import PagoForm from '$lib/components/pagos/PagoForm.svelte';

	let { data, form } = $props();
</script>

<section class="page">
	<header class="page-header">
		<h1>Registrar pago</h1>
		<p class="page-description">Registra un nuevo pago asociado a una cotización.</p>
	</header>

	<PagoForm {form} cotizaciones={data.cotizaciones} submitLabel="Registrar pago" />
</section>

<style>
	.page-header {
		margin-bottom: 1.5rem;
	}

	.page-header h1 {
		margin: 0 0 0.25rem;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.page-description {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-muted, #64748b);
	}
</style>

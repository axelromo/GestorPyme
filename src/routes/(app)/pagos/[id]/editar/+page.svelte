<script>
	import PagoForm from '$lib/components/pagos/PagoForm.svelte';

	let { data, form } = $props();
</script>

<section class="page">
	<header class="page-header">
		<h1>Editar pago</h1>
		<p class="page-description">Modifica los datos del pago registrado.</p>
	</header>

	<PagoForm
		{form}
		initialValues={data.initialValues}
		cotizacionEtiqueta={data.cotizacionEtiqueta}
		modoEdicion={true}
		submitLabel="Guardar cambios"
	/>
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

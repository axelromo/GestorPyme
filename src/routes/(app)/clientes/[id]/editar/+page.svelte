<script>
	import ClienteForm from '$lib/components/clientes/ClienteForm.svelte';

	let { data, form } = $props();
</script>

<section class="page">
	<header class="page-header">
		<h1>Editar cliente</h1>
		<p class="page-description">Modifica la información del cliente seleccionado.</p>
	</header>

	<ClienteForm {form} initialValues={data.initialValues} submitLabel="Actualizar cliente" />
</section>

<style>
	.page-header {
		margin-bottom: 1.5rem;
	}

	.page-header h1 {
		margin: 0 0 0.25rem;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text, #0f172a);
	}

	.page-description {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-muted, #64748b);
	}
</style>

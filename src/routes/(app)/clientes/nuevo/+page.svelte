<script>
	import ClienteForm from '$lib/components/clientes/ClienteForm.svelte';

	let { form } = $props();
</script>

<section class="page">
	<header class="page-header">
		<h1>Nuevo cliente</h1>
		<p class="page-description">Registra un nuevo cliente en el sistema.</p>
	</header>

	<ClienteForm {form} />
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

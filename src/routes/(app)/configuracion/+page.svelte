<script>
	import EmpresaForm from '$lib/components/configuracion/EmpresaForm.svelte';

	import Toast from '$lib/components/ui/Toast.svelte';
	import { obtenerMensajeExito } from '$lib/ui/mensajes.js';

	let { data, form } = $props();

	const mensajeExito = $derived(obtenerMensajeExito(data.exito));
</script>

<section class="page">
	<header class="page-header">
		<h1>Configuración de empresa</h1>
		<p class="page-description">
			Administra los datos de tu empresa. Se utilizarán en PDFs, correos y el dashboard.
		</p>
	</header>

	{#if mensajeExito}
		<Toast mensaje={mensajeExito} />
	{/if}

	<EmpresaForm {form} initialValues={data.initialValues} />
</section>

<style>
	.page {
		min-width: 0;
	}

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

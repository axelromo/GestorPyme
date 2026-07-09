<script>
	import Button from '$lib/components/ui/Button.svelte';

	/** @type {{ titulo: string, botonUrl: string }} */
	let { titulo, botonUrl } = $props();
</script>

<div class="toolbar">
	<div class="toolbar-info">
		<h1 class="toolbar-title">{titulo}</h1>
		<p class="toolbar-description">Listado de clientes registrados en el sistema.</p>
	</div>

	<Button href={botonUrl}>+ Nuevo Cliente</Button>
</div>

<style>
	.toolbar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.toolbar-info {
		flex: 1;
		min-width: 12rem;
	}
</style>

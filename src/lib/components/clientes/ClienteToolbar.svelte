<script>
	/** @type {{ titulo: string, botonUrl: string }} */
	let { titulo, botonUrl } = $props();
</script>

<div class="toolbar">
	<div class="toolbar-info">
		<h1 class="toolbar-title">{titulo}</h1>
		<p class="toolbar-description">Listado de clientes registrados en el sistema.</p>
	</div>

	<a class="btn-primary" href={botonUrl}>+ Nuevo Cliente</a>
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

	.toolbar-title {
		margin: 0 0 0.25rem;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text, #0f172a);
	}

	.toolbar-description {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-muted, #64748b);
	}

	.btn-primary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.625rem 1rem;
		border-radius: 0.375rem;
		background: var(--color-primary, #2563eb);
		color: #ffffff;
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		white-space: nowrap;
	}

	.btn-primary:hover {
		background: #1d4ed8;
	}
</style>

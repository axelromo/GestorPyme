<script>
	/** @type {{ titulo: string, mensaje: string, icono?: string }} */
	let { titulo, mensaje, icono = '📭' } = $props();
</script>

<div class="empty-state">
	<div class="icon" aria-hidden="true">{icono}</div>
	<h2>{titulo}</h2>
	<p>{mensaje}</p>
</div>

<style>
	.empty-state {
		padding: 2.5rem 1.5rem;
		text-align: center;
		background: #ffffff;
		border: 1px dashed var(--color-border, #e2e8f0);
		border-radius: 0.75rem;
	}

	.icon {
		font-size: 2.5rem;
		margin-bottom: 0.75rem;
	}

	h2 {
		margin: 0 0 0.5rem;
		font-size: 1.125rem;
		color: var(--color-text, #0f172a);
	}

	p {
		margin: 0;
		color: var(--color-text-muted, #64748b);
		font-size: 0.875rem;
	}
</style>

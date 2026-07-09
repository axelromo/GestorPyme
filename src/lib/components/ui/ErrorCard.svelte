<script>
	/** @type {{ titulo?: string, mensaje: string }} */
	let { titulo = 'Ocurrió un error', mensaje } = $props();
</script>

<div class="error-card" role="alert">
	<strong>{titulo}</strong>
	<p>{mensaje}</p>
</div>

<style>
	.error-card {
		margin-bottom: 1rem;
		padding: 0.875rem 1rem;
		border-radius: 0.5rem;
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #991b1b;
	}

	p {
		margin: 0.35rem 0 0;
		font-size: 0.875rem;
	}
</style>

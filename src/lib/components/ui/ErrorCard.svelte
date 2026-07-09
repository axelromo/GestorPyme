<script>
	/** @type {{ titulo?: string, mensaje: string }} */
	let { titulo = 'Ocurrió un error', mensaje } = $props();
</script>

<div class="error-card" role="alert">
	<span class="error-icon" aria-hidden="true">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
		</svg>
	</span>
	<div>
		<strong>{titulo}</strong>
		<p>{mensaje}</p>
	</div>
</div>

<style>
	.error-card {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 1rem;
		padding: 1rem 1.25rem;
		border-radius: var(--radius-md);
		background: var(--color-danger-soft);
		border: 1px solid #fecaca;
		color: #991b1b;
		box-shadow: var(--shadow-sm);
	}

	.error-icon {
		display: flex;
		flex-shrink: 0;
		width: 1.25rem;
		height: 1.25rem;
		margin-top: 0.125rem;
	}

	.error-icon svg {
		width: 100%;
		height: 100%;
	}

	p {
		margin: 0.35rem 0 0;
		font-size: 0.875rem;
	}
</style>

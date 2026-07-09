<script>
	/** @type {{ mensaje: string, onClose?: () => void }} */
	let { mensaje, onClose } = $props();
</script>

<div class="toast" role="status">
	<span>{mensaje}</span>
	{#if onClose}
		<button type="button" class="close" onclick={onClose} aria-label="Cerrar">×</button>
	{/if}
</div>

<style>
	.toast {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		background: #ecfdf5;
		border: 1px solid #a7f3d0;
		color: #047857;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.close {
		border: none;
		background: transparent;
		color: inherit;
		font-size: 1.25rem;
		line-height: 1;
		cursor: pointer;
	}
</style>

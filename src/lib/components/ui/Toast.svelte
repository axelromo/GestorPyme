<script>
	/** @type {{ mensaje: string, onClose?: () => void }} */
	let { mensaje, onClose } = $props();
</script>

<div class="toast" role="status">
	<span class="toast-icon" aria-hidden="true">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
		</svg>
	</span>
	<span class="toast-text">{mensaje}</span>
	{#if onClose}
		<button type="button" class="close" onclick={onClose} aria-label="Cerrar">×</button>
	{/if}
</div>

<style>
	.toast {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
		padding: 1rem 1.25rem;
		border-radius: var(--radius-md);
		background: var(--color-success-soft);
		border: 1px solid #86efac;
		color: #166534;
		font-size: 0.875rem;
		font-weight: 500;
		box-shadow: var(--shadow-md);
		animation: toast-in 0.35s ease;
	}

	.toast-icon {
		display: flex;
		flex-shrink: 0;
		width: 1.25rem;
		height: 1.25rem;
	}

	.toast-icon svg {
		width: 100%;
		height: 100%;
	}

	.toast-text {
		flex: 1;
	}

	.close {
		border: none;
		background: transparent;
		color: inherit;
		font-size: 1.25rem;
		line-height: 1;
		cursor: pointer;
		opacity: 0.7;
		transition: opacity var(--transition);
	}

	.close:hover {
		opacity: 1;
	}

	@keyframes toast-in {
		from {
			opacity: 0;
			transform: translateY(-0.5rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>

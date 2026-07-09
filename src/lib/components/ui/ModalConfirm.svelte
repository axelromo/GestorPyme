<script>
	import Button from '$lib/components/ui/Button.svelte';

	/**
	 * @type {{
	 *   abierto: boolean,
	 *   titulo: string,
	 *   mensaje: string,
	 *   confirmarTexto?: string,
	 *   cancelarTexto?: string,
	 *   peligroso?: boolean,
	 *   onConfirmar: () => void,
	 *   onCancelar: () => void
	 * }}
	 */
	let {
		abierto,
		titulo,
		mensaje,
		confirmarTexto = 'Confirmar',
		cancelarTexto = 'Cancelar',
		peligroso = false,
		onConfirmar,
		onCancelar
	} = $props();
</script>

{#if abierto}
	<div class="overlay" role="presentation" onclick={onCancelar}></div>
	<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
		<h2 id="modal-title">{titulo}</h2>
		<p>{mensaje}</p>
		<div class="actions">
			<Button variant="secondary" onclick={onCancelar}>{cancelarTexto}</Button>
			<Button variant={peligroso ? 'danger' : 'primary'} onclick={onConfirmar}>
				{confirmarTexto}
			</Button>
		</div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(15, 23, 42, 0.5);
		backdrop-filter: blur(2px);
		z-index: 40;
		animation: fade-in 0.2s ease;
	}

	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 50;
		width: min(26rem, calc(100vw - 2rem));
		padding: 1.5rem;
		background: var(--color-surface);
		border-radius: var(--radius-card);
		box-shadow: var(--shadow-lg);
		animation: modal-in 0.25s ease;
	}

	h2 {
		margin: 0 0 0.5rem;
		font-size: 1.125rem;
		font-weight: 600;
	}

	p {
		margin: 0 0 1.5rem;
		color: var(--color-text-muted);
		font-size: 0.875rem;
		line-height: 1.6;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes modal-in {
		from {
			opacity: 0;
			transform: translate(-50%, -48%);
		}
		to {
			opacity: 1;
			transform: translate(-50%, -50%);
		}
	}
</style>

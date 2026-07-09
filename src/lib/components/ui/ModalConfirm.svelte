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
		background: rgba(15, 23, 42, 0.45);
		z-index: 40;
	}

	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 50;
		width: min(24rem, calc(100vw - 2rem));
		padding: 1.25rem;
		background: #ffffff;
		border-radius: 0.75rem;
		box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);
	}

	h2 {
		margin: 0 0 0.5rem;
		font-size: 1.125rem;
	}

	p {
		margin: 0 0 1.25rem;
		color: var(--color-text-muted, #64748b);
		font-size: 0.875rem;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
	}
</style>

<script>
	import Button from '$lib/components/ui/Button.svelte';

	let { status = 500 } = $props();

	/** @type {Record<number, { titulo: string, mensaje: string, icono: string }>} */
	const MENSAJES = {
		404: {
			titulo: 'Página no encontrada',
			mensaje: 'La página que buscas no existe o fue movida.',
			icono: '🔍'
		},
		403: {
			titulo: 'Acceso denegado',
			mensaje: 'No tienes permiso para acceder a este recurso.',
			icono: '🔒'
		},
		500: {
			titulo: 'Error del servidor',
			mensaje: 'Ocurrió un error inesperado. Intenta nuevamente más tarde.',
			icono: '⚠️'
		}
	};

	const info = $derived(MENSAJES[status] ?? MENSAJES[500]);
</script>

<section class="error-page">
	<div class="error-content">
		<span class="icon" aria-hidden="true">{info.icono}</span>
		<p class="status">{status}</p>
		<h1>{info.titulo}</h1>
		<p class="mensaje">{info.mensaje}</p>
		<div class="actions">
			<Button href="/dashboard" variant="primary">Ir al dashboard</Button>
			<Button href="/sign-in" variant="secondary">Iniciar sesión</Button>
		</div>
	</div>
</section>

<style>
	.error-page {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		padding: 2rem 1rem;
	}

	.error-content {
		max-width: 28rem;
		width: 100%;
		text-align: center;
	}

	.icon {
		font-size: 3rem;
		display: block;
		margin-bottom: 0.5rem;
	}

	.status {
		margin: 0 0 0.25rem;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-text-muted, #64748b);
		letter-spacing: 0.08em;
	}

	h1 {
		margin: 0 0 0.75rem;
		font-size: 1.5rem;
	}

	.mensaje {
		margin: 0 0 1.25rem;
		color: var(--color-text-muted, #64748b);
		font-size: 0.9375rem;
		line-height: 1.5;
	}

	.actions {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-top: 1.25rem;
	}
</style>

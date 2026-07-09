<script>
	import { enhance } from '$app/forms';
	import ConceptosTable from '$lib/components/cotizaciones/ConceptosTable.svelte';
	import EstadoBadge from '$lib/components/cotizaciones/EstadoBadge.svelte';
	import EstadoSelector from '$lib/components/cotizaciones/EstadoSelector.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import ErrorCard from '$lib/components/ui/ErrorCard.svelte';
	import ModalConfirm from '$lib/components/ui/ModalConfirm.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { crearEnhanceEnvio } from '$lib/ui/formEnhance.js';
	import { obtenerMensajeExito } from '$lib/ui/mensajes.js';

	let { data, form } = $props();

	const cotizacion = $derived(data.cotizacion);
	const mensajeExito = $derived(obtenerMensajeExito(data.exito));
	const mensajeError = $derived(
		data.errorEnvio === 'sin-correo-cliente'
			? 'El cliente no tiene correo electrónico registrado.'
			: (form?.message ?? null)
	);

	let enviando = $state(false);
	let mostrarCancelar = $state(false);

	/** @type {HTMLFormElement | null} */
	let formularioCancelar = $state(null);

	/**
	 * @param {string | null} fecha
	 */
	function formatFecha(fecha) {
		if (!fecha) return '—';
		return new Date(fecha).toLocaleDateString('es-MX', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<section class="page">
	<div class="toolbar">
		<div>
			<h1>Cotización {cotizacion.folio}</h1>
			<p class="description">Detalle de la cotización.</p>
		</div>
		<div class="toolbar-actions">
			<form
				method="POST"
				action="?/enviar"
				class="inline-form"
				use:enhance={crearEnhanceEnvio(
					() => enviando,
					(v) => {
						enviando = v;
					}
				)}
			>
				<Button
					type="submit"
					variant="secondary"
					loading={enviando}
					disabled={!cotizacion.clienteEmail?.trim()}
					title={cotizacion.clienteEmail?.trim()
						? `Enviar a ${cotizacion.clienteEmail}`
						: 'El cliente no tiene correo registrado'}
				>
					Enviar por correo
				</Button>
			</form>
			<a class="btn-secondary" href="/cotizaciones/{cotizacion.id}/pdf">Descargar PDF</a>
			{#if data.puedeEditar}
				<a class="btn-primary" href="/cotizaciones/{cotizacion.id}/editar">Editar</a>
			{/if}
			{#if data.puedeCancelar}
				<Button variant="danger" onclick={() => (mostrarCancelar = true)}
					>Cancelar cotización</Button
				>
			{/if}
			<a class="btn-secondary" href="/cotizaciones">Regresar</a>
		</div>
	</div>

	{#if mensajeExito}
		<Toast mensaje={mensajeExito} />
	{/if}
	{#if mensajeError}
		<ErrorCard titulo="No se pudo enviar" mensaje={mensajeError} />
	{/if}
	{#if form?.cancelarError}
		<ErrorCard titulo="No se pudo cancelar" mensaje={form.cancelarError} />
	{/if}

	<form
		bind:this={formularioCancelar}
		method="POST"
		action="?/cancelar"
		use:enhance
		class="hidden-form"
	></form>

	<ModalConfirm
		abierto={mostrarCancelar}
		titulo="Cancelar cotización"
		mensaje="¿Seguro que deseas cancelar esta cotización? Esta acción cambiará el estado a rechazada."
		confirmarTexto="Sí, cancelar"
		peligroso={true}
		onConfirmar={() => formularioCancelar?.requestSubmit()}
		onCancelar={() => (mostrarCancelar = false)}
	/>

	<div class="info-card">
		<h2>Información general</h2>
		<dl class="info-grid">
			<div>
				<dt>Folio</dt>
				<dd>{cotizacion.folio}</dd>
			</div>
			<div>
				<dt>Cliente</dt>
				<dd>{cotizacion.clienteNombre}</dd>
			</div>
			<div>
				<dt>Fecha</dt>
				<dd>{formatFecha(cotizacion.fecha)}</dd>
			</div>
			<div>
				<dt>Fecha de vencimiento</dt>
				<dd>{formatFecha(cotizacion.fechaVencimiento)}</dd>
			</div>
			<div>
				<dt>Estado</dt>
				<dd><EstadoBadge estado={cotizacion.estado} /></dd>
			</div>
			<div class="full">
				<dt>Observaciones</dt>
				<dd>{cotizacion.observaciones?.trim() ? cotizacion.observaciones : '—'}</dd>
			</div>
		</dl>
	</div>

	<h2>Conceptos</h2>
	<ConceptosTable
		conceptos={cotizacion.conceptos}
		subtotal={cotizacion.subtotal}
		iva={cotizacion.iva}
		total={cotizacion.total}
	/>

	<h2>Cambiar estado</h2>
	{#if form?.estadoError}
		<p class="error">{form.estadoError}</p>
	{/if}
	<EstadoSelector estadoActual={cotizacion.estado} transiciones={data.transicionesPermitidas} />

	{#if cotizacion.historial.length > 0}
		<h2>Historial</h2>
		<div class="historial">
			{#each cotizacion.historial as evento}
				<article class="historial-item">
					<div class="historial-header">
						<strong>{evento.accion}</strong>
						<span>{formatFecha(evento.fecha)}</span>
					</div>
					{#if evento.descripcion}
						<p>{evento.descripcion}</p>
					{/if}
				</article>
			{/each}
		</div>
	{/if}
</section>

<style>
	.toolbar {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1.5rem;
	}

	h1,
	h2 {
		margin: 0 0 0.75rem;
		font-size: 1.25rem;
	}

	h1 {
		font-size: 1.5rem;
	}

	.description {
		margin: 0;
		color: var(--color-text-muted, #64748b);
		font-size: 0.875rem;
	}

	.toolbar-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		align-items: center;
	}

	.inline-form {
		display: contents;
	}

	.hidden-form {
		display: none;
	}

	.page {
		min-width: 0;
	}

	.btn-primary,
	.btn-secondary {
		display: inline-flex;
		padding: 0.625rem 1rem;
		border-radius: 0.375rem;
		font-weight: 600;
		text-decoration: none;
		font-size: inherit;
		font-family: inherit;
		cursor: pointer;
	}

	.btn-secondary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-primary {
		background: var(--color-primary, #2563eb);
		color: #ffffff;
	}

	.btn-secondary {
		border: 1px solid var(--color-border, #e2e8f0);
		background: #ffffff;
		color: var(--color-text, #0f172a);
	}

	.info-card,
	.historial {
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: #ffffff;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.5rem;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		gap: 1rem;
		margin: 0;
	}

	dt {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text-muted, #64748b);
	}

	dd {
		margin: 0.25rem 0 0;
	}

	.full {
		grid-column: 1 / -1;
	}

	.historial-item {
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--color-border, #e2e8f0);
	}

	.historial-item:last-child {
		border-bottom: none;
	}

	.historial-header {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	.historial-item p {
		margin: 0.5rem 0 0;
		color: var(--color-text-muted, #64748b);
		font-size: 0.875rem;
	}
</style>

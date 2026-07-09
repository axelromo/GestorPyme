<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import { crearEnhanceEnvio } from '$lib/ui/formEnhance.js';
	import { ETIQUETAS_METODO, METODOS_PAGO } from '$lib/validaciones/pago.js';

	/**
	 * @type {{
	 *   form?: {
	 *     errors?: Record<string, string>,
	 *     values?: Record<string, string>
	 *   },
	 *   initialValues?: Record<string, string>,
	 *   cotizaciones?: Array<{ id: string, folio: string, clienteNombre: string }>,
	 *   cotizacionEtiqueta?: string,
	 *   modoEdicion?: boolean,
	 *   submitLabel?: string
	 * }}
	 */
	let {
		form,
		initialValues = {},
		cotizaciones = [],
		cotizacionEtiqueta = '',
		modoEdicion = false,
		submitLabel = 'Guardar pago'
	} = $props();

	let guardando = $state(false);

	const values = $derived(form?.values ?? initialValues);
	const errors = $derived(form?.errors ?? {});

	/** @param {string} campo */
	function valorTexto(campo) {
		return values[campo] ?? '';
	}
</script>

<form
	method="POST"
	class="form"
	use:enhance={crearEnhanceEnvio(
		() => guardando,
		(v) => {
			guardando = v;
		}
	)}
>
	<div class="field">
		<label for="cotizacionId">Cotización *</label>
		{#if modoEdicion}
			<input type="hidden" name="cotizacionId" value={valorTexto('cotizacionId')} />
			<p class="readonly-value">{cotizacionEtiqueta}</p>
		{:else}
			<select id="cotizacionId" name="cotizacionId" required value={valorTexto('cotizacionId')}>
				<option value="">Selecciona una cotización</option>
				{#each cotizaciones as cotizacion (cotizacion.id)}
					<option value={cotizacion.id}>
						{cotizacion.folio} — {cotizacion.clienteNombre}
					</option>
				{/each}
			</select>
		{/if}
		{#if errors.cotizacionId}
			<p class="error">{errors.cotizacionId}</p>
		{/if}
	</div>

	<div class="field">
		<label for="fecha">Fecha *</label>
		<input id="fecha" name="fecha" type="date" required value={valorTexto('fecha')} />
		{#if errors.fecha}
			<p class="error">{errors.fecha}</p>
		{/if}
	</div>

	<div class="field">
		<label for="monto">Monto *</label>
		<input
			id="monto"
			name="monto"
			type="number"
			min="0.01"
			step="0.01"
			required
			value={valorTexto('monto')}
		/>
		{#if errors.monto}
			<p class="error">{errors.monto}</p>
		{/if}
	</div>

	<div class="field">
		<label for="metodo">Método *</label>
		<select id="metodo" name="metodo" required value={valorTexto('metodo')}>
			<option value="">Selecciona un método</option>
			{#each METODOS_PAGO as metodo}
				<option value={metodo}>{ETIQUETAS_METODO[metodo]}</option>
			{/each}
		</select>
		{#if errors.metodo}
			<p class="error">{errors.metodo}</p>
		{/if}
	</div>

	<div class="field">
		<label for="referencia">Referencia</label>
		<input id="referencia" name="referencia" type="text" value={valorTexto('referencia')} />
	</div>

	<div class="actions">
		<a class="btn-secondary" href="/pagos">Cancelar</a>
		<Button type="submit" loading={guardando}>{submitLabel}</Button>
	</div>
</form>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 32rem;
		padding: 1.5rem;
		background: var(--color-surface, #ffffff);
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.5rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text, #0f172a);
	}

	input,
	select {
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.375rem;
		font: inherit;
		color: var(--color-text, #0f172a);
		background: #ffffff;
	}

	input:focus,
	select:focus {
		outline: 2px solid var(--color-primary-soft, #eff6ff);
		border-color: var(--color-primary, #2563eb);
	}

	.readonly-value {
		margin: 0;
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.375rem;
		background: var(--color-sidebar, #f8fafc);
		font-size: 0.875rem;
	}

	.error {
		margin: 0;
		font-size: 0.8125rem;
		color: #dc2626;
	}

	.actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	.btn-secondary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.625rem 1rem;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
		border: 1px solid var(--color-border, #e2e8f0);
		background: var(--color-surface, #ffffff);
		color: var(--color-text, #0f172a);
	}

	.btn-secondary:hover {
		background: var(--color-surface-hover, #f1f5f9);
	}
</style>

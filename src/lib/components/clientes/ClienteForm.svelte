<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import { crearEnhanceEnvio } from '$lib/ui/formEnhance.js';

	/**
	 * @type {{
	 *   form?: {
	 *     errors?: Record<string, string>,
	 *     values?: Record<string, string | boolean>
	 *   },
	 *   initialValues?: Record<string, string | boolean>,
	 *   submitLabel?: string
	 * }}
	 */
	let { form, initialValues = {}, submitLabel = 'Guardar cliente' } = $props();

	let guardando = $state(false);

	const values = $derived(form?.values ?? initialValues);
	const errors = $derived(form?.errors ?? {});

	/** @param {string} campo */
	function valorTexto(campo) {
		const valor = values[campo];
		return typeof valor === 'string' ? valor : '';
	}

	/** @param {string} campo */
	function estaActivo(campo) {
		const valor = values[campo];
		return typeof valor === 'boolean' ? valor : true;
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
		<label for="nombre">Nombre *</label>
		<input id="nombre" name="nombre" type="text" required value={valorTexto('nombre')} />
		{#if errors.nombre}
			<p class="error">{errors.nombre}</p>
		{/if}
	</div>

	<div class="field">
		<label for="empresa">Empresa</label>
		<input id="empresa" name="empresa" type="text" value={valorTexto('empresa')} />
	</div>

	<div class="field">
		<label for="email">Email *</label>
		<input id="email" name="email" type="email" required value={valorTexto('email')} />
		{#if errors.email}
			<p class="error">{errors.email}</p>
		{/if}
	</div>

	<div class="field">
		<label for="telefono">Teléfono</label>
		<input id="telefono" name="telefono" type="tel" value={valorTexto('telefono')} />
	</div>

	<div class="field">
		<label for="direccion">Dirección</label>
		<input id="direccion" name="direccion" type="text" value={valorTexto('direccion')} />
	</div>

	<div class="field">
		<label for="rfc">RFC</label>
		<input id="rfc" name="rfc" type="text" value={valorTexto('rfc')} />
		{#if errors.rfc}
			<p class="error">{errors.rfc}</p>
		{/if}
	</div>

	<div class="field">
		<label for="notas">Notas</label>
		<textarea id="notas" name="notas" rows="3">{valorTexto('notas')}</textarea>
	</div>

	<div class="field field-checkbox">
		<label class="checkbox-label">
			<input name="activo" type="checkbox" checked={estaActivo('activo')} />
			Activo
		</label>
	</div>

	<div class="actions">
		<a class="btn-secondary" href="/clientes">Cancelar</a>
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
	textarea {
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.375rem;
		font: inherit;
		color: var(--color-text, #0f172a);
		background: #ffffff;
	}

	input:focus,
	textarea:focus {
		outline: 2px solid var(--color-primary-soft, #eff6ff);
		border-color: var(--color-primary, #2563eb);
	}

	.field-checkbox {
		margin-top: 0.25rem;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 500;
	}

	.checkbox-label input {
		width: 1rem;
		height: 1rem;
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

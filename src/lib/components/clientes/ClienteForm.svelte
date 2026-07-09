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
		max-width: 36rem;
	}

	.actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}
</style>

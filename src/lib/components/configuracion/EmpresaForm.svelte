<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import { crearEnhanceEnvio } from '$lib/ui/formEnhance.js';

	/**
	 * @type {{
	 *   form?: {
	 *     errors?: Record<string, string>,
	 *     values?: Record<string, string>
	 *   },
	 *   initialValues?: Record<string, string>
	 * }}
	 */
	let { form, initialValues = {} } = $props();

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
		<label for="nombreEmpresa">Nombre de la empresa *</label>
		<input
			id="nombreEmpresa"
			name="nombreEmpresa"
			type="text"
			required
			value={valorTexto('nombreEmpresa')}
		/>
		{#if errors.nombreEmpresa}
			<p class="error">{errors.nombreEmpresa}</p>
		{/if}
	</div>

	<div class="field">
		<label for="razonSocial">Razón social</label>
		<input id="razonSocial" name="razonSocial" type="text" value={valorTexto('razonSocial')} />
	</div>

	<div class="field">
		<label for="rfc">RFC</label>
		<input id="rfc" name="rfc" type="text" value={valorTexto('rfc')} />
		{#if errors.rfc}
			<p class="error">{errors.rfc}</p>
		{/if}
	</div>

	<div class="field">
		<label for="correo">Correo</label>
		<input id="correo" name="correo" type="email" value={valorTexto('correo')} />
		{#if errors.correo}
			<p class="error">{errors.correo}</p>
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

	<div class="field-row">
		<div class="field">
			<label for="ciudad">Ciudad</label>
			<input id="ciudad" name="ciudad" type="text" value={valorTexto('ciudad')} />
		</div>
		<div class="field">
			<label for="estado">Estado</label>
			<input id="estado" name="estado" type="text" value={valorTexto('estado')} />
		</div>
		<div class="field">
			<label for="codigoPostal">Código postal</label>
			<input id="codigoPostal" name="codigoPostal" type="text" value={valorTexto('codigoPostal')} />
		</div>
	</div>

	<div class="field">
		<label for="sitioWeb">Sitio web</label>
		<input
			id="sitioWeb"
			name="sitioWeb"
			type="url"
			placeholder="https://miempresa.com"
			value={valorTexto('sitioWeb')}
		/>
		{#if errors.sitioWeb}
			<p class="error">{errors.sitioWeb}</p>
		{/if}
	</div>

	<div class="field">
		<label for="logo">Logo (URL)</label>
		<input
			id="logo"
			name="logo"
			type="url"
			placeholder="https://ejemplo.com/logo.png"
			value={valorTexto('logo')}
		/>
		<p class="hint">
			Ingresa la URL del logo. Compatible con integración futura de Supabase Storage.
		</p>
		{#if errors.logo}
			<p class="error">{errors.logo}</p>
		{/if}
	</div>

	<div class="actions">
		<Button type="submit" loading={guardando}>Guardar configuración</Button>
	</div>
</form>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 40rem;
		padding: 1.5rem;
		background: var(--color-surface, #ffffff);
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.5rem;
	}

	.field-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
		gap: 1rem;
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

	input {
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.375rem;
		font: inherit;
		color: var(--color-text, #0f172a);
		background: #ffffff;
	}

	input:focus {
		outline: 2px solid var(--color-primary-soft, #eff6ff);
		border-color: var(--color-primary, #2563eb);
	}

	.hint {
		margin: 0;
		font-size: 0.75rem;
		color: var(--color-text-muted, #64748b);
	}

	.error {
		margin: 0;
		font-size: 0.8125rem;
		color: #dc2626;
	}

	.actions {
		margin-top: 0.5rem;
	}
</style>

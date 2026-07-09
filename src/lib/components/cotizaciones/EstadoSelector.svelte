<script>
	import { enhance } from '$app/forms';
	import { crearEnhanceEnvio } from '$lib/ui/formEnhance.js';
	import { ETIQUETAS_ESTADO } from '$lib/cotizaciones/estado.js';
	import Button from '$lib/components/ui/Button.svelte';
	import EstadoBadge from './EstadoBadge.svelte';

	/**
	 * @type {{
	 *   estadoActual: string,
	 *   transiciones: string[]
	 * }}
	 */
	let { estadoActual, transiciones = [] } = $props();

	let guardando = $state(false);
</script>

{#if transiciones.length > 0}
	<form
		method="POST"
		action="?/cambiarEstado"
		class="estado-form"
		use:enhance={crearEnhanceEnvio(
			() => guardando,
			(v) => {
				guardando = v;
			}
		)}
	>
		<div class="estado-actual">
			<span>Estado actual:</span>
			<EstadoBadge estado={estadoActual} />
		</div>

		<div class="field">
			<label for="nuevoEstado">Cambiar a</label>
			<select id="nuevoEstado" name="nuevoEstado" required>
				<option value="">Selecciona un estado</option>
				{#each transiciones as estado (estado)}
					<option value={estado}>{ETIQUETAS_ESTADO[estado] ?? estado}</option>
				{/each}
			</select>
		</div>

		<Button type="submit" loading={guardando}>Aplicar cambio</Button>
	</form>
{:else}
	<div class="estado-final">
		<span>Estado actual:</span>
		<EstadoBadge estado={estadoActual} />
		<p>No hay transiciones disponibles para este estado.</p>
	</div>
{/if}

<style>
	.estado-form,
	.estado-final {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		background: var(--color-surface, #ffffff);
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.5rem;
	}

	.estado-actual,
	.estado-final {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	label {
		font-size: 0.875rem;
		font-weight: 600;
	}

	select {
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.375rem;
		font: inherit;
	}

	.estado-final p {
		margin: 0;
		color: var(--color-text-muted, #64748b);
		font-size: 0.875rem;
	}
</style>

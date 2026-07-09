<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import { crearEnhanceEnvio } from '$lib/ui/formEnhance.js';
	import { calcularTotales } from '$lib/cotizaciones/calculos.js';
	import ConceptoRow from './ConceptoRow.svelte';

	/**
	 * @type {{
	 *   form?: { errors?: Record<string, string>, values?: Record<string, unknown> },
	 *   initialValues?: Record<string, unknown>,
	 *   clientes: Array<{ id: string, nombre: string, empresa: string | null }>,
	 *   submitLabel?: string
	 * }}
	 */
	let { form, initialValues = {}, clientes, submitLabel = 'Guardar cotización' } = $props();

	let guardando = $state(false);

	const values = $derived(form?.values ?? initialValues);
	const errors = $derived(form?.errors ?? {});

	/** @type {Array<{ descripcion: string, cantidad: string, precioUnitario: string, descuento: string }>} */
	let conceptos = $state([{ descripcion: '', cantidad: '1', precioUnitario: '0', descuento: '0' }]);

	$effect(() => {
		if (Array.isArray(values.conceptos) && values.conceptos.length > 0) {
			conceptos = values.conceptos;
		}
	});

	/** @param {string} campo */
	function valorTexto(campo) {
		const valor = values[campo];
		return typeof valor === 'string' ? valor : '';
	}

	const tasaIVA = $derived(Number(valorTexto('tasaIVA') || '0.16'));
	const totalesVista = $derived(
		calcularTotales(
			conceptos.map((concepto) => ({
				cantidad: Number(concepto.cantidad || 0),
				precioUnitario: Number(concepto.precioUnitario || 0),
				descuento: Number(concepto.descuento || 0)
			})),
			tasaIVA
		)
	);

	function agregarConcepto() {
		conceptos = [
			...conceptos,
			{ descripcion: '', cantidad: '1', precioUnitario: '0', descuento: '0' }
		];
	}

	/** @param {number} indice */
	function quitarConcepto(indice) {
		if (conceptos.length <= 1) {
			return;
		}
		conceptos = conceptos.filter((_, i) => i !== indice);
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
	<input type="hidden" name="tasaIVA" value={valorTexto('tasaIVA') || '0.16'} />

	<div class="grid">
		<div class="field">
			<label for="clienteId">Cliente *</label>
			<select id="clienteId" name="clienteId" required>
				<option value="">Selecciona un cliente</option>
				{#each clientes as cliente}
					<option value={cliente.id} selected={valorTexto('clienteId') === cliente.id}>
						{cliente.empresa ? `${cliente.nombre} (${cliente.empresa})` : cliente.nombre}
					</option>
				{/each}
			</select>
			{#if errors.clienteId}
				<p class="error">{errors.clienteId}</p>
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
			<label for="fechaVencimiento">Fecha de vencimiento</label>
			<input
				id="fechaVencimiento"
				name="fechaVencimiento"
				type="date"
				value={valorTexto('fechaVencimiento')}
			/>
			{#if errors.fechaVencimiento}
				<p class="error">{errors.fechaVencimiento}</p>
			{/if}
		</div>
	</div>

	<div class="field">
		<label for="observaciones">Observaciones</label>
		<textarea id="observaciones" name="observaciones" rows="3"
			>{valorTexto('observaciones')}</textarea
		>
	</div>

	<div class="conceptos-section">
		<div class="section-header">
			<h2>Conceptos</h2>
			<button class="btn-secondary" type="button" onclick={agregarConcepto}
				>+ Agregar concepto</button
			>
		</div>

		{#if errors.conceptos}
			<p class="error">{errors.conceptos}</p>
		{/if}

		<div class="table-wrapper">
			<table class="conceptos-table">
				<thead>
					<tr>
						<th>Descripción</th>
						<th>Cantidad</th>
						<th>Precio unitario</th>
						<th>Descuento</th>
						<th>Importe</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each conceptos as concepto, indice (indice)}
						<ConceptoRow
							{indice}
							{concepto}
							{errors}
							puedeEliminar={conceptos.length > 1}
							onRemove={() => quitarConcepto(indice)}
						/>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="totales">
			<p><span>Subtotal:</span> {totalesVista.subtotal.toFixed(2)}</p>
			<p><span>IVA:</span> {totalesVista.iva.toFixed(2)}</p>
			<p class="total"><span>Total:</span> {totalesVista.total.toFixed(2)}</p>
		</div>
	</div>

	<div class="actions">
		<a class="btn-secondary" href="/cotizaciones">Cancelar</a>
		<Button type="submit" loading={guardando}>{submitLabel}</Button>
	</div>
</form>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: 1rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	label,
	h2 {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text, #0f172a);
	}

	h2 {
		margin: 0;
		font-size: 1rem;
	}

	input,
	select,
	textarea {
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.375rem;
		font: inherit;
		background: #ffffff;
	}

	.conceptos-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.table-wrapper {
		overflow-x: auto;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.5rem;
		background: #ffffff;
	}

	.conceptos-table {
		width: 100%;
		border-collapse: collapse;
	}

	.conceptos-table th {
		padding: 0.75rem 0.5rem;
		text-align: left;
		font-size: 0.8125rem;
		color: var(--color-text-muted, #64748b);
		background: var(--color-sidebar, #f8fafc);
	}

	.totales {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		align-items: flex-end;
		font-size: 0.9375rem;
	}

	.totales span {
		font-weight: 600;
		margin-right: 0.5rem;
	}

	.total {
		font-size: 1.125rem;
		font-weight: 700;
	}

	.actions {
		display: flex;
		gap: 0.75rem;
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
		background: #ffffff;
		color: var(--color-text, #0f172a);
	}

	.error {
		margin: 0;
		font-size: 0.8125rem;
		color: #dc2626;
	}

	@media (max-width: 767px) {
		.grid {
			grid-template-columns: 1fr;
		}

		.section-header {
			flex-direction: column;
			align-items: stretch;
		}

		.section-header :global(.btn-secondary),
		.section-header .btn-secondary {
			width: 100%;
			justify-content: center;
		}

		.actions {
			flex-direction: column;
		}

		.actions > * {
			width: 100%;
			justify-content: center;
			text-align: center;
		}

		.table-wrapper {
			overflow: visible;
			border: none;
			background: transparent;
		}

		.conceptos-table {
			display: block;
		}

		.conceptos-table thead {
			display: none;
		}

		.conceptos-table tbody {
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
		}

		.conceptos-table :global(tr) {
			display: block;
			padding: 1rem;
			background: var(--color-surface);
			border: 1px solid var(--color-border);
			border-radius: var(--radius-md);
			box-shadow: var(--shadow-sm);
		}

		.conceptos-table :global(td) {
			display: block;
			padding: 0.625rem 0;
			border-bottom: none;
		}

		.conceptos-table :global(td::before) {
			content: attr(data-label);
			display: block;
			margin-bottom: 0.375rem;
			font-size: 0.6875rem;
			font-weight: 600;
			color: var(--color-text-muted);
			text-transform: uppercase;
			letter-spacing: 0.04em;
		}

		.conceptos-table :global(td.acciones) {
			padding-top: 0.25rem;
		}

		.conceptos-table :global(.importe) {
			font-size: 1rem;
		}

		.totales {
			align-items: stretch;
		}
	}
</style>

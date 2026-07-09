<script>
	import { calcularImporteConcepto } from '$lib/cotizaciones/calculos.js';

	/**
	 * @type {{
	 *   indice: number,
	 *   concepto: { descripcion?: string, cantidad?: string, precioUnitario?: string, descuento?: string },
	 *   errors?: Record<string, string>,
	 *   onRemove?: () => void,
	 *   puedeEliminar?: boolean
	 * }}
	 */
	let { indice, concepto, errors = {}, onRemove, puedeEliminar = true } = $props();

	const importe = $derived(
		calcularImporteConcepto(
			Number(concepto.cantidad || 0),
			Number(concepto.precioUnitario || 0),
			Number(concepto.descuento || 0)
		)
	);
</script>

<tr>
	<td data-label="Descripción">
		<input
			name={`conceptos[${indice}][descripcion]`}
			type="text"
			value={concepto.descripcion ?? ''}
			placeholder="Descripción"
		/>
		{#if errors[`conceptos[${indice}].descripcion`]}
			<p class="error">{errors[`conceptos[${indice}].descripcion`]}</p>
		{/if}
	</td>
	<td data-label="Cantidad">
		<input
			name={`conceptos[${indice}][cantidad]`}
			type="number"
			min="0.0001"
			step="0.0001"
			value={concepto.cantidad ?? ''}
		/>
		{#if errors[`conceptos[${indice}].cantidad`]}
			<p class="error">{errors[`conceptos[${indice}].cantidad`]}</p>
		{/if}
	</td>
	<td data-label="Precio unitario">
		<input
			name={`conceptos[${indice}][precioUnitario]`}
			type="number"
			min="0"
			step="0.01"
			value={concepto.precioUnitario ?? ''}
		/>
		{#if errors[`conceptos[${indice}].precioUnitario`]}
			<p class="error">{errors[`conceptos[${indice}].precioUnitario`]}</p>
		{/if}
	</td>
	<td data-label="Descuento">
		<input
			name={`conceptos[${indice}][descuento]`}
			type="number"
			min="0"
			step="0.01"
			value={concepto.descuento ?? '0'}
		/>
		{#if errors[`conceptos[${indice}].descuento`]}
			<p class="error">{errors[`conceptos[${indice}].descuento`]}</p>
		{/if}
	</td>
	<td class="importe" data-label="Importe">{importe.toFixed(2)}</td>
	<td class="acciones" data-label="Acciones">
		{#if puedeEliminar}
			<button class="btn-remove" type="button" onclick={onRemove}>Quitar</button>
		{/if}
	</td>
</tr>

<style>
	td {
		padding: 0.5rem;
		vertical-align: top;
		border-bottom: 1px solid var(--color-border, #e2e8f0);
	}

	input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.375rem;
		font: inherit;
	}

	.importe {
		font-weight: 600;
		white-space: nowrap;
	}

	.acciones {
		width: 1%;
		white-space: nowrap;
	}

	.btn-remove {
		padding: 0.375rem 0.625rem;
		border: 1px solid #fecaca;
		border-radius: 0.375rem;
		background: #fff1f2;
		color: #b91c1c;
		font-size: 0.8125rem;
		cursor: pointer;
		transition:
			background var(--transition),
			transform var(--transition);
	}

	.btn-remove:hover {
		background: #ffe4e6;
	}

	.btn-remove:focus-visible {
		outline: 2px solid var(--color-danger);
		outline-offset: 2px;
	}

	.btn-remove:active {
		transform: scale(0.98);
	}

	.error {
		margin: 0.25rem 0 0;
		font-size: 0.75rem;
		color: #dc2626;
	}
</style>

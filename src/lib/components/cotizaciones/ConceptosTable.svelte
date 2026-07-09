<script>
	import { formatearMoneda } from '$lib/cotizaciones/calculos.js';
	import MobileDataCard from '$lib/components/ui/MobileDataCard.svelte';
	import MobileDataRow from '$lib/components/ui/MobileDataRow.svelte';

	/**
	 * @type {{
	 *   conceptos: Array<{
	 *     descripcion: string,
	 *     cantidad: number,
	 *     precioUnitario: number,
	 *     importe: number,
	 *     descuento?: number
	 *   }>,
	 *   subtotal: number,
	 *   iva: number,
	 *   total: number,
	 *   editable?: boolean
	 * }}
	 */
	let { conceptos, subtotal, iva, total, editable = false } = $props();
</script>

<div class="table-wrapper table-desktop">
	<table class="table">
		<thead>
			<tr>
				<th>Descripción</th>
				<th>Cantidad</th>
				<th>Precio unitario</th>
				{#if editable}
					<th>Descuento</th>
				{/if}
				<th>Importe</th>
			</tr>
		</thead>
		<tbody>
			{#each conceptos as concepto}
				<tr>
					<td>{concepto.descripcion}</td>
					<td>{concepto.cantidad}</td>
					<td>{formatearMoneda(concepto.precioUnitario)}</td>
					{#if editable}
						<td>{formatearMoneda(concepto.descuento ?? 0)}</td>
					{/if}
					<td>{formatearMoneda(concepto.importe)}</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<td colspan={editable ? 4 : 3} class="totales-label">Subtotal</td>
				<td>{formatearMoneda(subtotal)}</td>
			</tr>
			<tr>
				<td colspan={editable ? 4 : 3} class="totales-label">IVA</td>
				<td>{formatearMoneda(iva)}</td>
			</tr>
			<tr>
				<td colspan={editable ? 4 : 3} class="totales-label total">Total</td>
				<td class="total">{formatearMoneda(total)}</td>
			</tr>
		</tfoot>
	</table>
</div>

<div class="mobile-card-list">
	{#each conceptos as concepto, indice (indice)}
		<MobileDataCard>
			{#snippet children()}
				<MobileDataRow label="Descripción">{concepto.descripcion}</MobileDataRow>
				<MobileDataRow label="Cantidad">{concepto.cantidad}</MobileDataRow>
				<MobileDataRow label="Precio unitario">{formatearMoneda(concepto.precioUnitario)}</MobileDataRow>
				{#if editable}
					<MobileDataRow label="Descuento">{formatearMoneda(concepto.descuento ?? 0)}</MobileDataRow>
				{/if}
				<MobileDataRow label="Importe">{formatearMoneda(concepto.importe)}</MobileDataRow>
			{/snippet}
		</MobileDataCard>
	{/each}

	<article class="mobile-data-card mobile-totals">
		<div class="mobile-data-card-body">
			<MobileDataRow label="Subtotal">{formatearMoneda(subtotal)}</MobileDataRow>
			<MobileDataRow label="IVA">{formatearMoneda(iva)}</MobileDataRow>
			<MobileDataRow label="Total">{formatearMoneda(total)}</MobileDataRow>
		</div>
	</article>
</div>

<style>
	.table-wrapper {
		overflow-x: auto;
		background: var(--color-surface, #ffffff);
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.5rem;
	}

	.table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	th,
	td {
		padding: 0.75rem 1rem;
		text-align: left;
		border-bottom: 1px solid var(--color-border, #e2e8f0);
	}

	th {
		font-weight: 600;
		color: var(--color-text-muted, #64748b);
		background: var(--color-sidebar, #f8fafc);
	}

	tfoot td {
		border-bottom: none;
	}

	.totales-label {
		text-align: right;
		font-weight: 600;
		color: var(--color-text-muted, #64748b);
	}

	.total {
		font-weight: 700;
		color: var(--color-text, #0f172a);
	}

	.mobile-totals {
		background: var(--color-primary-soft);
		border-color: #bfdbfe;
	}
</style>

/**
 * @param {number} cantidad
 * @param {number} precioUnitario
 * @param {number} [descuento]
 */
export function calcularImporteConcepto(cantidad, precioUnitario, descuento = 0) {
	const importe = cantidad * precioUnitario - descuento;
	return Math.max(0, Math.round(importe * 100) / 100);
}

/**
 * @param {Array<{ cantidad: number, precioUnitario: number, descuento?: number }>} conceptos
 * @param {number} tasaIVA
 */
export function calcularTotales(conceptos, tasaIVA) {
	const subtotal = conceptos.reduce(
		(acumulado, concepto) =>
			acumulado +
			calcularImporteConcepto(concepto.cantidad, concepto.precioUnitario, concepto.descuento ?? 0),
		0
	);

	const subtotalRedondeado = Math.round(subtotal * 100) / 100;
	const iva = Math.round(subtotalRedondeado * tasaIVA * 100) / 100;
	const total = Math.round((subtotalRedondeado + iva) * 100) / 100;

	return {
		subtotal: subtotalRedondeado,
		iva,
		total
	};
}

/**
 * @param {number} valor
 * @param {number} [decimales]
 */
export function formatearMoneda(valor, decimales = 2) {
	return new Intl.NumberFormat('es-MX', {
		style: 'currency',
		currency: 'MXN',
		minimumFractionDigits: decimales,
		maximumFractionDigits: decimales
	}).format(valor);
}

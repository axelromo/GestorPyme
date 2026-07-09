import { formatearMoneda } from '$lib/cotizaciones/calculos.js';

/**
 * @param {number | import('@prisma/client/runtime/library').Decimal} total
 * @param {number} totalPagado
 */
export function calcularSaldoPendiente(total, totalPagado) {
	return Math.max(0, Math.round((Number(total) - totalPagado) * 100) / 100);
}

/**
 * @param {Date | string} fecha
 */
export function calcularDiasTranscurridos(fecha) {
	const referencia = new Date();
	const inicio = new Date(fecha);
	referencia.setHours(0, 0, 0, 0);
	inicio.setHours(0, 0, 0, 0);
	const diferencia = referencia.getTime() - inicio.getTime();
	return Math.max(0, Math.floor(diferencia / (1000 * 60 * 60 * 24)));
}

/**
 * @param {Array<{ monto: import('@prisma/client/runtime/library').Decimal | number }>} pagos
 */
export function sumarPagos(pagos) {
	return pagos.reduce((acumulado, pago) => acumulado + Number(pago.monto), 0);
}

/**
 * @param {{
 *   id: string,
 *   folio: string,
 *   fecha: Date,
 *   total: import('@prisma/client/runtime/library').Decimal | number,
 *   estado: string,
 *   cliente: { id: string, nombre: string, empresa: string | null, email: string },
 *   pagos: Array<{ monto: import('@prisma/client/runtime/library').Decimal | number }>
 * }} cotizacion
 */
export function serializarFilaCobranza(cotizacion) {
	const total = Number(cotizacion.total);
	const pagado = sumarPagos(cotizacion.pagos);
	const saldo = calcularSaldoPendiente(total, pagado);

	return {
		id: cotizacion.id,
		folio: cotizacion.folio,
		estado: cotizacion.estado,
		fecha: cotizacion.fecha.toISOString(),
		clienteId: cotizacion.cliente.id,
		clienteNombre: cotizacion.cliente.empresa
			? `${cotizacion.cliente.nombre} (${cotizacion.cliente.empresa})`
			: cotizacion.cliente.nombre,
		clienteEmail: cotizacion.cliente.email,
		total,
		pagado,
		saldo,
		diasTranscurridos: calcularDiasTranscurridos(cotizacion.fecha)
	};
}

/**
 * @param {Array<ReturnType<typeof serializarFilaCobranza>>} filas
 */
export function calcularCarteraPendiente(filas) {
	return filas.reduce((acumulado, fila) => acumulado + fila.saldo, 0);
}

/**
 * @param {Array<ReturnType<typeof serializarFilaCobranza>>} filas
 * @param {number} [limite]
 */
export function agruparSaldoPorCliente(filas, limite = 5) {
	/** @type {Record<string, { clienteId: string, clienteNombre: string, saldo: number }>} */
	const mapa = {};

	for (const fila of filas) {
		if (!mapa[fila.clienteId]) {
			mapa[fila.clienteId] = {
				clienteId: fila.clienteId,
				clienteNombre: fila.clienteNombre,
				saldo: 0
			};
		}
		mapa[fila.clienteId].saldo += fila.saldo;
	}

	return Object.values(mapa)
		.sort((a, b) => b.saldo - a.saldo)
		.slice(0, limite)
		.map((fila) => ({
			...fila,
			saldoFormateado: formatearMoneda(fila.saldo)
		}));
}

import { Prisma } from '@prisma/client';
import { puedeTransicionar } from '$lib/cotizaciones/estado.js';
import { registrarHistorial } from '$lib/server/cotizaciones.js';

/**
 * @param {import('@prisma/client').Prisma.TransactionClient} tx
 * @param {string} cotizacionId
 */
export async function calcularTotalPagado(tx, cotizacionId) {
	const resultado = await tx.pago.aggregate({
		where: { cotizacionId },
		_sum: { monto: true }
	});

	return Number(resultado._sum.monto ?? 0);
}

/**
 * @param {import('@prisma/client').Prisma.TransactionClient} tx
 * @param {string} cotizacionId
 * @param {string} usuarioId
 * @param {string} descripcion
 */
export async function sincronizarCotizacionPorPagos(tx, cotizacionId, usuarioId, descripcion) {
	const cotizacion = await tx.cotizacion.findUnique({
		where: { id: cotizacionId },
		select: { total: true, estado: true }
	});

	if (!cotizacion) {
		return;
	}

	const totalPagado = await calcularTotalPagado(tx, cotizacionId);
	const totalCotizacion = Number(cotizacion.total);
	let nuevoEstado = cotizacion.estado;

	if (totalPagado >= totalCotizacion && puedeTransicionar(cotizacion.estado, 'PAGADA')) {
		nuevoEstado = 'PAGADA';
	} else if (totalPagado < totalCotizacion && cotizacion.estado === 'PAGADA') {
		nuevoEstado = 'FACTURADA';
	}

	if (nuevoEstado !== cotizacion.estado) {
		await tx.cotizacion.update({
			where: { id: cotizacionId },
			data: { estado: nuevoEstado }
		});
	}

	await registrarHistorial(tx, {
		cotizacionId,
		accion: 'PAGO_REGISTRADO',
		descripcion,
		usuarioId
	});
}

/**
 * @param {{
 *   cotizacionId: string,
 *   fecha: Date,
 *   monto: string | number,
 *   metodo: import('@prisma/client').MetodoPago,
 *   referencia: string | null
 * }} data
 */
export function mapPagoDataAPrisma(data) {
	return {
		cotizacionId: data.cotizacionId,
		fecha: data.fecha,
		monto: new Prisma.Decimal(data.monto),
		metodo: data.metodo,
		referencia: data.referencia
	};
}

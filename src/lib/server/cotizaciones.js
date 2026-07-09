import { Prisma } from '@prisma/client';

/**
 * @param {import('@prisma/client').PrismaClient | import('@prisma/client').Prisma.TransactionClient} prisma
 */
export async function generarFolio(prisma) {
	const anio = new Date().getFullYear();
	const prefijo = `COT-${anio}-`;

	const ultima = await prisma.cotizacion.findFirst({
		where: { folio: { startsWith: prefijo } },
		orderBy: { folio: 'desc' },
		select: { folio: true }
	});

	if (!ultima) {
		return `${prefijo}0001`;
	}

	const secuencia = Number(ultima.folio.replace(prefijo, ''));
	const siguiente = Number.isNaN(secuencia) ? 1 : secuencia + 1;

	return `${prefijo}${String(siguiente).padStart(4, '0')}`;
}

/**
 * @param {import('@prisma/client').Prisma.TransactionClient} tx
 * @param {{
 *   cotizacionId: string,
 *   accion: import('@prisma/client').AccionHistorial,
 *   descripcion?: string,
 *   usuarioId: string
 * }} params
 */
export async function registrarHistorial(tx, params) {
	await tx.historial.create({
		data: {
			cotizacionId: params.cotizacionId,
			accion: params.accion,
			descripcion: params.descripcion ?? null,
			usuarioId: params.usuarioId
		}
	});
}

/**
 * @param {import('@prisma/client').Prisma.TransactionClient} tx
 * @param {string} cotizacionId
 * @param {Array<{ descripcion: string, cantidad: number, precioUnitario: number, descuento: number, importe: number }>} conceptos
 */
export async function reemplazarConceptos(tx, cotizacionId, conceptos) {
	await tx.concepto.deleteMany({ where: { cotizacionId } });

	if (conceptos.length === 0) {
		return;
	}

	await tx.concepto.createMany({
		data: conceptos.map((concepto, indice) => ({
			cotizacionId,
			descripcion: concepto.descripcion,
			cantidad: new Prisma.Decimal(concepto.cantidad),
			precioUnitario: new Prisma.Decimal(concepto.precioUnitario),
			descuento: new Prisma.Decimal(concepto.descuento ?? 0),
			importe: new Prisma.Decimal(concepto.importe),
			orden: indice + 1
		}))
	});
}

/**
 * @param {{ subtotal: number, iva: number, total: number }} totales
 */
export function mapTotalesAPrisma(totales) {
	return {
		subtotal: new Prisma.Decimal(totales.subtotal),
		iva: new Prisma.Decimal(totales.iva),
		total: new Prisma.Decimal(totales.total)
	};
}

/**
 * @param {string} estado
 */
export function accionHistorialPorEstado(estado) {
	/** @type {Record<string, import('@prisma/client').AccionHistorial>} */
	const mapa = {
		ENVIADA: 'ENVIADA',
		APROBADA: 'APROBADA',
		RECHAZADA: 'RECHAZADA',
		FACTURADA: 'FACTURADA',
		PAGADA: 'PAGO_REGISTRADO'
	};

	return mapa[estado] ?? 'EDITADA';
}

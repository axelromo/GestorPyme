import { error } from '@sveltejs/kit';
import prisma from '$lib/server/prisma.js';
import { obtenerConfiguracionEmpresa } from '$lib/server/configuracion.js';
import { generarPDF } from '$lib/server/pdf/cotizacion.js';
import { logger } from '$lib/server/logger.js';
import { esUuidValido } from '$lib/server/seguridad.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	if (!esUuidValido(params.id)) {
		error(400, 'Cotización no válida');
	}

	try {
		const [cotizacion, empresa] = await Promise.all([
			prisma.cotizacion.findUnique({
				where: { id: params.id },
				include: {
					cliente: true,
					conceptos: { orderBy: { orden: 'asc' } }
				}
			}),
			obtenerConfiguracionEmpresa()
		]);

		if (!cotizacion) {
			error(404, 'Cotización no encontrada');
		}

		const pdfBytes = await generarPDF(
			cotizacion,
			cotizacion.cliente,
			cotizacion.conceptos,
			empresa
		);

		return new Response(pdfBytes, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="${cotizacion.folio}.pdf"`
			}
		});
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		logger.pdf('endpoint', err, { cotizacionId: params.id });
		error(500, 'No se pudo generar el PDF. Intenta nuevamente.');
	}
}

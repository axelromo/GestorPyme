import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma.js';
import {
	calcularCarteraPendiente,
	calcularDiasTranscurridos,
	calcularSaldoPendiente,
	serializarFilaCobranza,
	sumarPagos
} from '$lib/server/cobranza.js';
import { enviarRecordatorioCobranza } from '$lib/server/email/enviarRecordatorio.js';
import { manejarErrorAccion, manejarErrorCarga } from '$lib/server/manejoErrores.js';
import { esUuidValido, requerirUsuarioAccion } from '$lib/server/seguridad.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	try {
		const cotizaciones = await prisma.cotizacion.findMany({
			where: {
				estado: { in: ['APROBADA', 'FACTURADA'] }
			},
			include: {
				cliente: { select: { id: true, nombre: true, empresa: true, email: true } },
				pagos: { select: { monto: true } }
			},
			orderBy: { fecha: 'asc' }
		});

		const filas = cotizaciones
			.map(serializarFilaCobranza)
			.filter((fila) => fila.saldo > 0);

		return {
			filas,
			carteraPendiente: calcularCarteraPendiente(filas),
			exito: url.searchParams.get('exito'),
			error: url.searchParams.get('error')
		};
	} catch (err) {
		manejarErrorCarga('cobranza.load', err, 'No se pudo cargar la cartera de cobranza.');
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	recordatorio: async ({ request, locals }) => {
		const auth = requerirUsuarioAccion(locals);
		if (typeof auth !== 'string') {
			return auth;
		}

		try {
			const id = String((await request.formData()).get('id') ?? '').trim();
			if (!esUuidValido(id)) {
				return fail(400, { message: 'Cotización no válida.' });
			}

			const cotizacion = await prisma.cotizacion.findUnique({
				where: { id },
				include: {
					cliente: true,
					pagos: { select: { monto: true } }
				}
			});

			if (!cotizacion) {
				return fail(404, { message: 'Cotización no encontrada.' });
			}

			if (!['APROBADA', 'FACTURADA'].includes(cotizacion.estado)) {
				return fail(400, { message: 'La cotización no está en cobranza.' });
			}

			const saldo = calcularSaldoPendiente(cotizacion.total, sumarPagos(cotizacion.pagos));
			if (saldo <= 0) {
				redirect(303, '/cobranza?error=sin-saldo');
			}

			await enviarRecordatorioCobranza({
				cotizacion,
				saldo,
				diasTranscurridos: calcularDiasTranscurridos(cotizacion.fecha)
			});

			redirect(303, '/cobranza?exito=recordatorio-enviado');
		} catch (err) {
			return manejarErrorAccion('cobranza.recordatorio', err);
		}
	}
};

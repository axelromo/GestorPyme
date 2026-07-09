import { error } from '@sveltejs/kit';
import prisma from '$lib/server/prisma.js';
import {
	calcularSaldoPendiente,
	sumarPagos
} from '$lib/server/cobranza.js';
import { manejarErrorCarga } from '$lib/server/manejoErrores.js';
import { validarUuidParam } from '$lib/server/seguridad.js';
import { ETIQUETAS_ESTADO } from '$lib/cotizaciones/estado.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	validarUuidParam(params.id, 'cliente');

	try {
		const cliente = await prisma.cliente.findUnique({
			where: { id: params.id },
			include: {
				cotizaciones: {
					orderBy: { fecha: 'desc' },
					include: {
						pagos: { select: { monto: true } }
					}
				}
			}
		});

		if (!cliente) {
			error(404, 'Cliente no encontrado');
		}

		const estadosFacturados = new Set(['APROBADA', 'FACTURADA', 'PAGADA']);
		let totalFacturado = 0;
		let totalCobrado = 0;
		let saldoPendiente = 0;

		const cotizaciones = cliente.cotizaciones.map((cotizacion) => {
			const total = Number(cotizacion.total);
			const pagado = sumarPagos(cotizacion.pagos);
			const saldo = calcularSaldoPendiente(total, pagado);

			if (estadosFacturados.has(cotizacion.estado)) {
				totalFacturado += total;
			}

			totalCobrado += pagado;

			if (['APROBADA', 'FACTURADA'].includes(cotizacion.estado) && saldo > 0) {
				saldoPendiente += saldo;
			}

			return {
				id: cotizacion.id,
				folio: cotizacion.folio,
				estado: cotizacion.estado,
				estadoEtiqueta: ETIQUETAS_ESTADO[cotizacion.estado] ?? cotizacion.estado,
				fecha: cotizacion.fecha.toISOString(),
				total,
				pagado,
				saldo
			};
		});

		return {
			cliente: {
				id: cliente.id,
				nombre: cliente.nombre,
				empresa: cliente.empresa,
				email: cliente.email,
				telefono: cliente.telefono,
				direccion: cliente.direccion,
				rfc: cliente.rfc,
				notas: cliente.notas,
				activo: cliente.activo,
				createdAt: cliente.createdAt.toISOString()
			},
			cotizaciones,
			resumen: {
				totalFacturado,
				totalCobrado,
				saldoPendiente
			}
		};
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		manejarErrorCarga('clientes.perfil.load', err, 'No se pudo cargar el perfil del cliente.');
	}
}

import { error, fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma.js';
import {
	puedeEditar,
	puedeTransicionar,
	obtenerTransicionesPermitidas
} from '$lib/cotizaciones/estado.js';
import { accionHistorialPorEstado, registrarHistorial } from '$lib/server/cotizaciones.js';
import { enviarCotizacion } from '$lib/server/email/enviarCotizacion.js';
import { manejarErrorAccion, manejarErrorCarga } from '$lib/server/manejoErrores.js';
import { requerirUsuarioAccion, validarUuidParam } from '$lib/server/seguridad.js';
import { serializarCotizacionDetalle } from '$lib/validaciones/cotizacion.js';

/** @param {string} id */
async function obtenerCotizacion(id) {
	const cotizacion = await prisma.cotizacion.findUnique({
		where: { id },
		include: {
			cliente: { select: { id: true, nombre: true, empresa: true, email: true } },
			conceptos: true,
			historial: { orderBy: { fecha: 'desc' } }
		}
	});

	if (!cotizacion) {
		error(404, 'Cotización no encontrada');
	}

	return cotizacion;
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url }) {
	validarUuidParam(params.id, 'cotización');

	try {
		const cotizacion = await obtenerCotizacion(params.id);

		return {
			cotizacion: serializarCotizacionDetalle(cotizacion),
			puedeEditar: puedeEditar(cotizacion.estado),
			puedeCancelar: obtenerTransicionesPermitidas(cotizacion.estado).includes('RECHAZADA'),
			transicionesPermitidas: obtenerTransicionesPermitidas(cotizacion.estado),
			exito: url.searchParams.get('exito'),
			errorEnvio: url.searchParams.get('error')
		};
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		manejarErrorCarga('cotizaciones.detalle.load', err, 'No se pudo cargar la cotización.');
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	cambiarEstado: async ({ request, params, locals }) => {
		const auth = requerirUsuarioAccion(locals);
		if (typeof auth !== 'string') {
			return auth;
		}

		validarUuidParam(params.id, 'cotización');

		try {
			const cotizacion = await obtenerCotizacion(params.id);
			const formData = await request.formData();
			const nuevoEstado = String(formData.get('nuevoEstado') ?? '').trim();

			if (!nuevoEstado) {
				return fail(400, { estadoError: 'Debes seleccionar un estado.' });
			}

			if (!puedeTransicionar(cotizacion.estado, nuevoEstado)) {
				return fail(400, {
					estadoError: `No se puede cambiar de ${cotizacion.estado} a ${nuevoEstado}.`
				});
			}

			await prisma.$transaction(async (tx) => {
				await tx.cotizacion.update({
					where: { id: params.id },
					data: { estado: /** @type {import('@prisma/client').EstadoCotizacion} */ (nuevoEstado) }
				});

				await registrarHistorial(tx, {
					cotizacionId: params.id,
					accion: accionHistorialPorEstado(nuevoEstado),
					descripcion: `Estado cambiado de ${cotizacion.estado} a ${nuevoEstado}`,
					usuarioId: auth
				});
			});
		} catch (err) {
			return manejarErrorAccion('cotizaciones.cambiarEstado', err);
		}

		redirect(303, `/cotizaciones/${params.id}?exito=estado-actualizado`);
	},

	cancelar: async ({ params, locals }) => {
		const auth = requerirUsuarioAccion(locals);
		if (typeof auth !== 'string') {
			return auth;
		}

		validarUuidParam(params.id, 'cotización');

		try {
			const cotizacion = await obtenerCotizacion(params.id);

			if (!puedeTransicionar(cotizacion.estado, 'RECHAZADA')) {
				return fail(400, {
					cancelarError: `No se puede cancelar una cotización en estado ${cotizacion.estado}.`
				});
			}

			await prisma.$transaction(async (tx) => {
				await tx.cotizacion.update({
					where: { id: params.id },
					data: { estado: 'RECHAZADA' }
				});

				await registrarHistorial(tx, {
					cotizacionId: params.id,
					accion: accionHistorialPorEstado('RECHAZADA'),
					descripcion: `Cotización cancelada (estado anterior: ${cotizacion.estado})`,
					usuarioId: auth
				});
			});

			redirect(303, `/cotizaciones/${params.id}?exito=cotizacion-cancelada`);
		} catch (err) {
			if (err && typeof err === 'object' && 'status' in err) {
				throw err;
			}
			return manejarErrorAccion('cotizaciones.cancelar', err);
		}
	},

	enviar: async ({ params, locals }) => {
		const auth = requerirUsuarioAccion(locals);
		if (typeof auth !== 'string') {
			return auth;
		}

		validarUuidParam(params.id, 'cotización');

		try {
			const cotizacion = await prisma.cotizacion.findUnique({
				where: { id: params.id },
				include: {
					cliente: true,
					conceptos: { orderBy: { orden: 'asc' } }
				}
			});

			if (!cotizacion) {
				error(404, 'Cotización no encontrada');
			}

			if (!cotizacion.cliente.email?.trim()) {
				redirect(303, `/cotizaciones/${params.id}?error=sin-correo-cliente`);
			}

			await enviarCotizacion(cotizacion);

			await prisma.$transaction(async (tx) => {
				if (puedeTransicionar(cotizacion.estado, 'ENVIADA')) {
					await tx.cotizacion.update({
						where: { id: params.id },
						data: { estado: 'ENVIADA' }
					});
				}

				await registrarHistorial(tx, {
					cotizacionId: params.id,
					accion: 'ENVIADA',
					descripcion: `Cotización enviada por correo a ${cotizacion.cliente.email.trim()}`,
					usuarioId: auth
				});
			});

			redirect(303, `/cotizaciones/${params.id}?exito=cotizacion-enviada`);
		} catch (err) {
			if (err && typeof err === 'object' && 'status' in err) {
				throw err;
			}
			return manejarErrorAccion('cotizaciones.enviar', err);
		}
	}
};

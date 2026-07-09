import { error, fail, redirect } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';
import prisma from '$lib/server/prisma.js';
import { puedeEditar } from '$lib/cotizaciones/estado.js';
import {
	mapTotalesAPrisma,
	registrarHistorial,
	reemplazarConceptos
} from '$lib/server/cotizaciones.js';
import { manejarErrorAccion, manejarErrorCarga } from '$lib/server/manejoErrores.js';
import { esUuidValido, requerirUsuarioAccion, validarUuidParam } from '$lib/server/seguridad.js';
import {
	mapCotizacionToFormValues,
	validarCotizacionFormulario
} from '$lib/validaciones/cotizacion.js';

/** @param {string} id */
async function obtenerCotizacion(id) {
	const cotizacion = await prisma.cotizacion.findUnique({
		where: { id },
		include: {
			cliente: { select: { id: true, nombre: true, empresa: true } },
			conceptos: true
		}
	});

	if (!cotizacion) {
		error(404, 'Cotización no encontrada');
	}

	return cotizacion;
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	validarUuidParam(params.id, 'cotización');

	try {
		const cotizacion = await obtenerCotizacion(params.id);
		const editable = puedeEditar(cotizacion.estado);

		const clientes = await prisma.cliente.findMany({
			where: { activo: true },
			orderBy: { nombre: 'asc' },
			select: { id: true, nombre: true, empresa: true }
		});

		return {
			clientes,
			initialValues: mapCotizacionToFormValues(cotizacion),
			bloqueada: !editable,
			folio: cotizacion.folio,
			estado: cotizacion.estado,
			cotizacionId: cotizacion.id
		};
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		manejarErrorCarga('cotizaciones.editar.load', err, 'No se pudo cargar la cotización.');
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, params, locals }) => {
		const auth = requerirUsuarioAccion(locals);
		if (typeof auth !== 'string') {
			return auth;
		}

		validarUuidParam(params.id, 'cotización');

		try {
			const cotizacion = await obtenerCotizacion(params.id);

			if (!puedeEditar(cotizacion.estado)) {
				return fail(403, {
					message: 'La cotización ya no puede modificarse.'
				});
			}

			const formData = await request.formData();
			const { errors, values, conceptos, totales, tasaIVANumero } =
				validarCotizacionFormulario(formData);

			if (Object.keys(errors).length > 0) {
				return fail(400, { errors, values });
			}

			if (!esUuidValido(String(values.clienteId))) {
				return fail(400, {
					errors: { clienteId: 'El cliente seleccionado no es válido.' },
					values
				});
			}

			const cliente = await prisma.cliente.findUnique({
				where: { id: String(values.clienteId) }
			});

			if (!cliente) {
				return fail(400, {
					errors: { clienteId: 'El cliente seleccionado no existe.' },
					values
				});
			}

			await prisma.$transaction(async (tx) => {
				await tx.cotizacion.update({
					where: { id: params.id },
					data: {
						clienteId: String(values.clienteId),
						fecha: new Date(String(values.fecha)),
						fechaVencimiento: values.fechaVencimiento
							? new Date(String(values.fechaVencimiento))
							: null,
						tasaIVA: new Prisma.Decimal(tasaIVANumero),
						...mapTotalesAPrisma(totales),
						observaciones: values.observaciones ? String(values.observaciones) : null
					}
				});

				await reemplazarConceptos(tx, params.id, conceptos);
				await registrarHistorial(tx, {
					cotizacionId: params.id,
					accion: 'EDITADA',
					descripcion: `Cotización ${cotizacion.folio} actualizada`,
					usuarioId: auth
				});
			});

			redirect(303, '/cotizaciones?exito=cotizacion-actualizada');
		} catch (err) {
			if (err && typeof err === 'object' && 'status' in err) {
				throw err;
			}
			return manejarErrorAccion('cotizaciones.editar', err);
		}
	}
};

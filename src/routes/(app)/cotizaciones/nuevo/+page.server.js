import { fail, redirect } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';
import prisma from '$lib/server/prisma.js';
import {
	generarFolio,
	mapTotalesAPrisma,
	registrarHistorial,
	reemplazarConceptos
} from '$lib/server/cotizaciones.js';
import { manejarErrorAccion, manejarErrorCarga } from '$lib/server/manejoErrores.js';
import { esUuidValido, requerirUsuarioAccion } from '$lib/server/seguridad.js';
import { validarCotizacionFormulario } from '$lib/validaciones/cotizacion.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	try {
		const clientes = await prisma.cliente.findMany({
			where: { activo: true },
			orderBy: { nombre: 'asc' },
			select: { id: true, nombre: true, empresa: true }
		});

		return {
			clientes,
			initialValues: {
				clienteId: '',
				fecha: new Date().toISOString().slice(0, 10),
				fechaVencimiento: '',
				observaciones: '',
				tasaIVA: '0.16',
				conceptos: [{ descripcion: '', cantidad: '1', precioUnitario: '0', descuento: '0' }]
			}
		};
	} catch (err) {
		manejarErrorCarga('cotizaciones.nuevo.load', err, 'No se pudo cargar el formulario.');
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals }) => {
		const auth = requerirUsuarioAccion(locals);
		if (typeof auth !== 'string') {
			return auth;
		}

		try {
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
				const folio = await generarFolio(tx);

				const nueva = await tx.cotizacion.create({
					data: {
						folio,
						clienteId: String(values.clienteId),
						fecha: new Date(String(values.fecha)),
						fechaVencimiento: values.fechaVencimiento
							? new Date(String(values.fechaVencimiento))
							: null,
						moneda: 'MXN',
						tasaIVA: new Prisma.Decimal(tasaIVANumero),
						...mapTotalesAPrisma(totales),
						estado: 'BORRADOR',
						observaciones: values.observaciones ? String(values.observaciones) : null,
						createdBy: auth
					}
				});

				await reemplazarConceptos(tx, nueva.id, conceptos);
				await registrarHistorial(tx, {
					cotizacionId: nueva.id,
					accion: 'CREADA',
					descripcion: `Cotización ${folio} creada`,
					usuarioId: auth
				});
			});

			redirect(303, '/cotizaciones?exito=cotizacion-creada');
		} catch (err) {
			return manejarErrorAccion('cotizaciones.crear', err);
		}
	}
};

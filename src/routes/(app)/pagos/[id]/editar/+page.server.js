import { error, fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma.js';
import { manejarErrorAccion, manejarErrorCarga } from '$lib/server/manejoErrores.js';
import { requerirUsuarioAccion, validarUuidParam } from '$lib/server/seguridad.js';
import { mapPagoDataAPrisma, sincronizarCotizacionPorPagos } from '$lib/server/pagos.js';
import {
	mapPagoToFormValues,
	mapValuesToPagoData,
	validarPagoFormulario
} from '$lib/validaciones/pago.js';
import { formatearMoneda } from '$lib/cotizaciones/calculos.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	validarUuidParam(params.id, 'pago');

	try {
		const pago = await prisma.pago.findUnique({
			where: { id: params.id },
			include: {
				cotizacion: {
					select: {
						folio: true,
						cliente: { select: { nombre: true, empresa: true } }
					}
				}
			}
		});

		if (!pago) {
			error(404, 'Pago no encontrado');
		}

		const clienteNombre = pago.cotizacion.cliente.empresa
			? `${pago.cotizacion.cliente.nombre} (${pago.cotizacion.cliente.empresa})`
			: pago.cotizacion.cliente.nombre;

		return {
			initialValues: mapPagoToFormValues(pago),
			cotizacionEtiqueta: `${pago.cotizacion.folio} — ${clienteNombre}`
		};
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		manejarErrorCarga('pagos.editar.load', err, 'No se pudo cargar el pago.');
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, params, locals }) => {
		const auth = requerirUsuarioAccion(locals);
		if (typeof auth !== 'string') {
			return auth;
		}

		validarUuidParam(params.id, 'pago');

		try {
			const pagoExistente = await prisma.pago.findUnique({
				where: { id: params.id },
				include: {
					cotizacion: { select: { folio: true } }
				}
			});

			if (!pagoExistente) {
				error(404, 'Pago no encontrado');
			}

			const formData = await request.formData();
			formData.set('cotizacionId', pagoExistente.cotizacionId);

			const { errors, values } = validarPagoFormulario(formData);

			if (Object.keys(errors).length > 0) {
				return fail(400, { errors, values });
			}

			const datosPago = mapValuesToPagoData(values);

			await prisma.$transaction(async (tx) => {
				await tx.pago.update({
					where: { id: params.id },
					data: mapPagoDataAPrisma(datosPago)
				});

				await sincronizarCotizacionPorPagos(
					tx,
					pagoExistente.cotizacionId,
					auth,
					`Pago actualizado por ${formatearMoneda(Number(datosPago.monto))} en cotización ${pagoExistente.cotizacion.folio}`
				);
			});

			redirect(303, '/pagos?exito=pago-actualizado');
		} catch (err) {
			if (err && typeof err === 'object' && 'status' in err) {
				throw err;
			}
			return manejarErrorAccion('pagos.editar', err);
		}
	}
};

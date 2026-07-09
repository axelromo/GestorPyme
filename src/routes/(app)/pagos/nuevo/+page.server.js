import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma.js';
import { manejarErrorAccion, manejarErrorCarga } from '$lib/server/manejoErrores.js';
import { esUuidValido, requerirUsuarioAccion } from '$lib/server/seguridad.js';
import { mapPagoDataAPrisma, sincronizarCotizacionPorPagos } from '$lib/server/pagos.js';
import { mapValuesToPagoData, validarPagoFormulario } from '$lib/validaciones/pago.js';
import { formatearMoneda } from '$lib/cotizaciones/calculos.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	try {
		const cotizaciones = await prisma.cotizacion.findMany({
			where: {
				estado: { not: 'PAGADA' }
			},
			orderBy: { folio: 'desc' },
			select: {
				id: true,
				folio: true,
				cliente: { select: { nombre: true, empresa: true } }
			}
		});

		return {
			cotizaciones: cotizaciones.map((cotizacion) => ({
				id: cotizacion.id,
				folio: cotizacion.folio,
				clienteNombre: cotizacion.cliente.empresa
					? `${cotizacion.cliente.nombre} (${cotizacion.cliente.empresa})`
					: cotizacion.cliente.nombre
			}))
		};
	} catch (err) {
		manejarErrorCarga('pagos.nuevo.load', err, 'No se pudo cargar el formulario de pago.');
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
			const { errors, values } = validarPagoFormulario(formData);

			if (Object.keys(errors).length > 0) {
				return fail(400, { errors, values });
			}

			if (!esUuidValido(String(values.cotizacionId))) {
				return fail(400, {
					errors: { cotizacionId: 'La cotización seleccionada no es válida.' },
					values
				});
			}

			const cotizacion = await prisma.cotizacion.findUnique({
				where: { id: values.cotizacionId },
				select: { id: true, folio: true }
			});

			if (!cotizacion) {
				return fail(400, {
					errors: { cotizacionId: 'La cotización seleccionada no existe.' },
					values
				});
			}

			const datosPago = mapValuesToPagoData(values);

			await prisma.$transaction(async (tx) => {
				await tx.pago.create({
					data: mapPagoDataAPrisma(datosPago)
				});

				await sincronizarCotizacionPorPagos(
					tx,
					datosPago.cotizacionId,
					auth,
					`Pago registrado por ${formatearMoneda(Number(datosPago.monto))} en cotización ${cotizacion.folio}`
				);
			});

			redirect(303, '/pagos?exito=pago-registrado');
		} catch (err) {
			return manejarErrorAccion('pagos.crear', err);
		}
	}
};

import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma.js';
import { esUuidValido } from '$lib/server/seguridad.js';
import { calcularPaginacion, parsearListado } from '$lib/ui/listado.js';
import { manejarErrorAccion, manejarErrorCarga } from '$lib/server/manejoErrores.js';
import { requerirUsuarioAccion } from '$lib/server/seguridad.js';
import { sincronizarCotizacionPorPagos } from '$lib/server/pagos.js';
import { METODOS_PAGO, serializarPagoListado } from '$lib/validaciones/pago.js';

/** @type {Record<string, object>} */
const ORDEN_PAGOS = {
	fecha: { fecha: true },
	folio: { cotizacion: { folio: true } },
	cliente: { cotizacion: { cliente: { nombre: true } } },
	metodo: { metodo: true },
	monto: { monto: true },
	estado: { fecha: true }
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	try {
		const listado = parsearListado(url, 'fecha', 'desc');
		const ordenConfig = ORDEN_PAGOS[listado.orden] ?? ORDEN_PAGOS.fecha;
		const ordenCampo = Object.keys(ordenConfig)[0];

		/** @type {import('@prisma/client').Prisma.PagoWhereInput} */
		const where = {};

		if (listado.q) {
			where.OR = [
				{ cotizacion: { folio: { contains: listado.q, mode: 'insensitive' } } },
				{ cotizacion: { cliente: { nombre: { contains: listado.q, mode: 'insensitive' } } } },
				{ cotizacion: { cliente: { empresa: { contains: listado.q, mode: 'insensitive' } } } }
			];
		}

		if (
			listado.metodo &&
			METODOS_PAGO.includes(/** @type {import('@prisma/client').MetodoPago} */ (listado.metodo))
		) {
			where.metodo = /** @type {import('@prisma/client').MetodoPago} */ (listado.metodo);
		}

		/** @type {import('@prisma/client').Prisma.PagoOrderByWithRelationInput} */
		let orderBy = { fecha: listado.direccion };
		if (ordenCampo === 'cotizacion') {
			const subCampo = Object.keys(ordenConfig.cotizacion)[0];
			if (subCampo === 'folio') {
				orderBy = { cotizacion: { folio: listado.direccion } };
			} else {
				orderBy = { cotizacion: { cliente: { nombre: listado.direccion } } };
			}
		} else if (ordenCampo !== 'fecha' && ordenCampo !== 'metodo' && ordenCampo !== 'monto') {
			orderBy = { fecha: listado.direccion };
		} else if (ordenCampo !== 'cotizacion') {
			orderBy = { [ordenCampo]: listado.direccion };
		}

		const [pagos, total] = await Promise.all([
			prisma.pago.findMany({
				where,
				orderBy,
				skip: listado.skip,
				take: listado.take,
				include: {
					cotizacion: {
						select: {
							folio: true,
							total: true,
							cliente: { select: { nombre: true, empresa: true } },
							pagos: { select: { monto: true } }
						}
					}
				}
			}),
			prisma.pago.count({ where })
		]);

		const paginacion = calcularPaginacion(total, listado.pagina);

		return {
			pagos: pagos.map(serializarPagoListado),
			paginacion,
			filtros: {
				q: listado.q,
				metodo: listado.metodo,
				orden: listado.orden in ORDEN_PAGOS ? listado.orden : 'fecha',
				dir: listado.direccion
			},
			metodos: METODOS_PAGO,
			exito: url.searchParams.get('exito')
		};
	} catch (err) {
		manejarErrorCarga('pagos.load', err, 'No se pudieron cargar los pagos.');
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	eliminar: async ({ request, locals }) => {
		const auth = requerirUsuarioAccion(locals);
		if (typeof auth !== 'string') {
			return auth;
		}

		try {
			const id = String((await request.formData()).get('id') ?? '').trim();
			if (!esUuidValido(id)) {
				return fail(400, { message: 'Pago no válido.' });
			}

			const pago = await prisma.pago.findUnique({
				where: { id },
				include: { cotizacion: { select: { id: true, folio: true } } }
			});

			if (!pago) {
				return fail(404, { message: 'Pago no encontrado.' });
			}

			await prisma.$transaction(async (tx) => {
				await tx.pago.delete({ where: { id } });
				await sincronizarCotizacionPorPagos(
					tx,
					pago.cotizacionId,
					auth,
					`Pago eliminado de la cotización ${pago.cotizacion.folio}`
				);
			});

			redirect(303, '/pagos?exito=pago-eliminado');
		} catch (err) {
			return manejarErrorAccion('pagos.eliminar', err);
		}
	}
};

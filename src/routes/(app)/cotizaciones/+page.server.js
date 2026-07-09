import prisma from '$lib/server/prisma.js';
import { ESTADOS_COTIZACION } from '$lib/cotizaciones/estado.js';
import { calcularPaginacion, parsearListado } from '$lib/ui/listado.js';
import { manejarErrorCarga } from '$lib/server/manejoErrores.js';

/** @type {Record<string, object>} */
const ORDEN_COTIZACIONES = {
	folio: { folio: true },
	cliente: { cliente: { nombre: true } },
	fecha: { fecha: true },
	estado: { estado: true },
	total: { total: true }
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	try {
		const listado = parsearListado(url, 'fecha', 'desc');
		const ordenConfig = ORDEN_COTIZACIONES[listado.orden] ?? ORDEN_COTIZACIONES.fecha;
		const ordenCampo = Object.keys(ordenConfig)[0];

		/** @type {import('@prisma/client').Prisma.CotizacionWhereInput} */
		const where = {};

		if (listado.q) {
			where.OR = [
				{ folio: { contains: listado.q, mode: 'insensitive' } },
				{ cliente: { nombre: { contains: listado.q, mode: 'insensitive' } } },
				{ cliente: { empresa: { contains: listado.q, mode: 'insensitive' } } }
			];
		}

		if (listado.estado && ESTADOS_COTIZACION.includes(listado.estado)) {
			where.estado = /** @type {import('@prisma/client').EstadoCotizacion} */ (listado.estado);
		}

		if (listado.desde || listado.hasta) {
			where.fecha = {};
			if (listado.desde) {
				where.fecha.gte = new Date(`${listado.desde}T00:00:00`);
			}
			if (listado.hasta) {
				where.fecha.lte = new Date(`${listado.hasta}T23:59:59`);
			}
		}

		/** @type {import('@prisma/client').Prisma.CotizacionOrderByWithRelationInput} */
		const orderBy =
			ordenCampo === 'cliente'
				? { cliente: { nombre: listado.direccion } }
				: { [ordenCampo]: listado.direccion };

		const [cotizaciones, total] = await Promise.all([
			prisma.cotizacion.findMany({
				where,
				orderBy,
				skip: listado.skip,
				take: listado.take,
				include: {
					cliente: {
						select: { nombre: true, empresa: true }
					}
				}
			}),
			prisma.cotizacion.count({ where })
		]);

		const paginacion = calcularPaginacion(total, listado.pagina);

		return {
			cotizaciones: cotizaciones.map((cotizacion) => ({
				id: cotizacion.id,
				folio: cotizacion.folio,
				clienteNombre: cotizacion.cliente.empresa
					? `${cotizacion.cliente.nombre} (${cotizacion.cliente.empresa})`
					: cotizacion.cliente.nombre,
				fecha: cotizacion.fecha.toISOString(),
				estado: cotizacion.estado,
				total: Number(cotizacion.total)
			})),
			paginacion,
			filtros: {
				q: listado.q,
				estado: listado.estado,
				desde: listado.desde,
				hasta: listado.hasta,
				orden: listado.orden in ORDEN_COTIZACIONES ? listado.orden : 'fecha',
				dir: listado.direccion
			},
			estados: ESTADOS_COTIZACION,
			exito: url.searchParams.get('exito')
		};
	} catch (err) {
		manejarErrorCarga('cotizaciones.load', err, 'No se pudieron cargar las cotizaciones.');
	}
}

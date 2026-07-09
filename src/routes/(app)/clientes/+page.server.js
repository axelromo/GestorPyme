import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma.js';
import { esUuidValido, requerirUsuarioAccion } from '$lib/server/seguridad.js';
import { calcularPaginacion, parsearListado } from '$lib/ui/listado.js';
import { manejarErrorAccion, manejarErrorCarga } from '$lib/server/manejoErrores.js';

/** @type {Record<string, string>} */
const ORDEN_CLIENTES = {
	nombre: 'nombre',
	empresa: 'empresa',
	email: 'email',
	estado: 'activo',
	fecha: 'createdAt'
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	try {
		const listado = parsearListado(url, 'nombre', 'asc');
		const ordenCampo = ORDEN_CLIENTES[listado.orden] ?? 'nombre';

		/** @type {import('@prisma/client').Prisma.ClienteWhereInput} */
		const where = listado.q
			? {
					OR: [
						{ nombre: { contains: listado.q, mode: 'insensitive' } },
						{ empresa: { contains: listado.q, mode: 'insensitive' } },
						{ email: { contains: listado.q, mode: 'insensitive' } }
					]
				}
			: {};

		const [clientes, total] = await Promise.all([
			prisma.cliente.findMany({
				where,
				orderBy: { [ordenCampo]: listado.direccion },
				skip: listado.skip,
				take: listado.take,
				select: {
					id: true,
					nombre: true,
					empresa: true,
					email: true,
					telefono: true,
					activo: true,
					createdAt: true,
					_count: { select: { cotizaciones: true } }
				}
			}),
			prisma.cliente.count({ where })
		]);

		const paginacion = calcularPaginacion(total, listado.pagina);

		return {
			clientes: clientes.map((cliente) => ({
				id: cliente.id,
				nombre: cliente.nombre,
				empresa: cliente.empresa,
				email: cliente.email,
				telefono: cliente.telefono,
				activo: cliente.activo,
				createdAt: cliente.createdAt.toISOString(),
				tieneCotizaciones: cliente._count.cotizaciones > 0
			})),
			paginacion,
			filtros: {
				q: listado.q,
				orden: listado.orden in ORDEN_CLIENTES ? listado.orden : 'nombre',
				dir: listado.direccion
			},
			exito: url.searchParams.get('exito'),
			error: url.searchParams.get('error')
		};
	} catch (err) {
		manejarErrorCarga('clientes.load', err, 'No se pudieron cargar los clientes.');
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
			const formData = await request.formData();
			const id = String(formData.get('id') ?? '').trim();

			if (!esUuidValido(id)) {
				return fail(400, { message: 'Cliente no válido.' });
			}

			const cotizaciones = await prisma.cotizacion.count({ where: { clienteId: id } });
			if (cotizaciones > 0) {
				redirect(303, '/clientes?error=cliente-con-cotizaciones');
			}

			await prisma.cliente.delete({ where: { id } });
			redirect(303, '/clientes?exito=cliente-eliminado');
		} catch (err) {
			return manejarErrorAccion('clientes.eliminar', err);
		}
	},

	desactivar: async ({ request, locals }) => {
		const auth = requerirUsuarioAccion(locals);
		if (typeof auth !== 'string') {
			return auth;
		}

		try {
			const id = String((await request.formData()).get('id') ?? '').trim();
			if (!esUuidValido(id)) {
				return fail(400, { message: 'Cliente no válido.' });
			}

			await prisma.cliente.update({
				where: { id },
				data: { activo: false }
			});

			redirect(303, '/clientes?exito=cliente-desactivado');
		} catch (err) {
			return manejarErrorAccion('clientes.desactivar', err);
		}
	},

	activar: async ({ request, locals }) => {
		const auth = requerirUsuarioAccion(locals);
		if (typeof auth !== 'string') {
			return auth;
		}

		try {
			const id = String((await request.formData()).get('id') ?? '').trim();
			if (!esUuidValido(id)) {
				return fail(400, { message: 'Cliente no válido.' });
			}

			await prisma.cliente.update({
				where: { id },
				data: { activo: true }
			});

			redirect(303, '/clientes?exito=cliente-activado');
		} catch (err) {
			return manejarErrorAccion('clientes.activar', err);
		}
	}
};

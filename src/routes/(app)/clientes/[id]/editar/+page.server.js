import { error, fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma.js';
import { manejarErrorAccion, manejarErrorCarga } from '$lib/server/manejoErrores.js';
import { requerirUsuarioAccion, validarUuidParam } from '$lib/server/seguridad.js';
import {
	mapClienteToFormValues,
	mapValuesToClienteData,
	validarClienteFormulario
} from '$lib/validaciones/cliente.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	validarUuidParam(params.id, 'cliente');

	try {
		const cliente = await prisma.cliente.findUnique({
			where: { id: params.id }
		});

		if (!cliente) {
			error(404, 'Cliente no encontrado');
		}

		return {
			initialValues: mapClienteToFormValues(cliente)
		};
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		manejarErrorCarga('clientes.editar.load', err, 'No se pudo cargar el cliente.');
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, params, locals }) => {
		const auth = requerirUsuarioAccion(locals);
		if (typeof auth !== 'string') {
			return auth;
		}

		validarUuidParam(params.id, 'cliente');

		try {
			const cliente = await prisma.cliente.findUnique({
				where: { id: params.id }
			});

			if (!cliente) {
				error(404, 'Cliente no encontrado');
			}

			const formData = await request.formData();
			const { errors, values } = validarClienteFormulario(formData);

			if (Object.keys(errors).length > 0) {
				return fail(400, { errors, values });
			}

			await prisma.cliente.update({
				where: { id: params.id },
				data: mapValuesToClienteData(values)
			});

			redirect(303, '/clientes?exito=cliente-actualizado');
		} catch (err) {
			if (err && typeof err === 'object' && 'status' in err) {
				throw err;
			}
			return manejarErrorAccion('clientes.editar', err);
		}
	}
};

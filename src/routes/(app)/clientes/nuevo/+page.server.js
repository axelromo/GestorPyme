import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma.js';
import { manejarErrorAccion } from '$lib/server/manejoErrores.js';
import { requerirUsuarioAccion } from '$lib/server/seguridad.js';
import { mapValuesToClienteData, validarClienteFormulario } from '$lib/validaciones/cliente.js';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals }) => {
		const auth = requerirUsuarioAccion(locals);
		if (typeof auth !== 'string') {
			return auth;
		}

		try {
			const formData = await request.formData();
			const { errors, values } = validarClienteFormulario(formData);

			if (Object.keys(errors).length > 0) {
				return fail(400, { errors, values });
			}

			await prisma.cliente.create({
				data: mapValuesToClienteData(values)
			});

			redirect(303, '/clientes?exito=cliente-creado');
		} catch (err) {
			return manejarErrorAccion('clientes.crear', err);
		}
	}
};

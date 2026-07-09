import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma.js';
import { manejarErrorAccion, manejarErrorCarga } from '$lib/server/manejoErrores.js';
import { requerirUsuarioAccion } from '$lib/server/seguridad.js';
import { obtenerConfiguracionEmpresa } from '$lib/server/configuracion.js';
import {
	mapEmpresaToFormValues,
	mapValuesToEmpresaData,
	validarEmpresaFormulario
} from '$lib/validaciones/empresa.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	try {
		const empresa = await obtenerConfiguracionEmpresa();

		return {
			initialValues: mapEmpresaToFormValues(empresa),
			exito: url.searchParams.get('exito')
		};
	} catch (err) {
		manejarErrorCarga('configuracion.load', err, 'No se pudo cargar la configuración.');
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
			const empresa = await obtenerConfiguracionEmpresa();
			const formData = await request.formData();
			const { errors, values } = validarEmpresaFormulario(formData);

			if (Object.keys(errors).length > 0) {
				return fail(400, { errors, values });
			}

			await prisma.configuracionEmpresa.update({
				where: { id: empresa.id },
				data: mapValuesToEmpresaData(values)
			});

			redirect(303, '/configuracion?exito=configuracion-guardada');
		} catch (err) {
			return manejarErrorAccion('configuracion.guardar', err);
		}
	}
};

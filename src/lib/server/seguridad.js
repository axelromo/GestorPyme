import { error, fail } from '@sveltejs/kit';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * @param {unknown} id
 */
export function esUuidValido(id) {
	return typeof id === 'string' && UUID_REGEX.test(id);
}

/**
 * @param {string} id
 * @param {string} [etiqueta]
 */
export function validarUuidParam(id, etiqueta = 'recurso') {
	if (!esUuidValido(id)) {
		error(400, `El identificador del ${etiqueta} no es válido.`);
	}
}

/**
 * @param {import('@sveltejs/kit').RequestEvent['locals']} locals
 */
export function obtenerUserId(locals) {
	return locals.auth().userId ?? null;
}

/**
 * @param {import('@sveltejs/kit').RequestEvent['locals']} locals
 */
export function requerirUsuarioAccion(locals) {
	const userId = obtenerUserId(locals);
	if (!userId) {
		return fail(401, { message: 'No autenticado.' });
	}
	return userId;
}

import { error, fail, isHttpError, isRedirect } from '@sveltejs/kit';
import { logger } from '$lib/server/logger.js';

/**
 * @param {unknown} err
 */
export function relanzarSiEsControlado(err) {
	if (isRedirect(err) || isHttpError(err)) {
		throw err;
	}
}

/**
 * @param {string} contexto
 * @param {unknown} err
 * @param {string} [mensaje]
 * @returns {never}
 */
export function manejarErrorCarga(
	contexto,
	err,
	mensaje = 'No se pudo cargar la información. Intenta nuevamente.'
) {
	relanzarSiEsControlado(err);
	logger.prisma(contexto, err);
	error(500, mensaje);
}

/**
 * @param {string} contexto
 * @param {unknown} err
 */
export function manejarErrorAccion(contexto, err) {
	relanzarSiEsControlado(err);
	logger.prisma(contexto, err);
	return fail(500, {
		message: 'No se pudo completar la operación. Intenta nuevamente.'
	});
}

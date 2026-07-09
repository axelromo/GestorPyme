/** @type {Record<string, string[]>} */
export const TRANSICIONES_VALIDAS = {
	BORRADOR: ['ENVIADA'],
	ENVIADA: ['APROBADA', 'RECHAZADA'],
	APROBADA: ['FACTURADA'],
	RECHAZADA: [],
	FACTURADA: ['PAGADA'],
	PAGADA: []
};

/** @type {string[]} */
export const ESTADOS_COTIZACION = Object.keys(TRANSICIONES_VALIDAS);

/** @type {Record<string, string>} */
export const ETIQUETAS_ESTADO = {
	BORRADOR: 'Borrador',
	ENVIADA: 'Enviada',
	APROBADA: 'Aprobada',
	RECHAZADA: 'Rechazada',
	FACTURADA: 'Facturada',
	PAGADA: 'Pagada'
};

/** @type {Set<string>} */
export const ESTADOS_EDITABLES = new Set(['BORRADOR', 'ENVIADA']);

/**
 * @param {string} estadoActual
 * @param {string} nuevoEstado
 */
export function puedeTransicionar(estadoActual, nuevoEstado) {
	return TRANSICIONES_VALIDAS[estadoActual]?.includes(nuevoEstado) ?? false;
}

/**
 * @param {string} estado
 */
export function puedeEditar(estado) {
	return ESTADOS_EDITABLES.has(estado);
}

/**
 * @param {string} estado
 */
export function obtenerTransicionesPermitidas(estado) {
	return TRANSICIONES_VALIDAS[estado] ?? [];
}

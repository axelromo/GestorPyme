/** @type {Record<string, string>} */
export const MENSAJES_EXITO = {
	'cliente-creado': 'Cliente creado correctamente.',
	'cliente-actualizado': 'Cliente actualizado correctamente.',
	'cliente-eliminado': 'Cliente eliminado correctamente.',
	'pago-registrado': 'Pago registrado correctamente.',
	'pago-actualizado': 'Pago actualizado correctamente.',
	'pago-eliminado': 'Pago eliminado correctamente.',
	'cotizacion-creada': 'Cotización creada correctamente.',
	'cotizacion-actualizada': 'Cotización actualizada correctamente.',
	'cotizacion-cancelada': 'Cotización cancelada correctamente.',
	'cotizacion-enviada': 'Cotización enviada correctamente.',
	'estado-actualizado': 'Estado actualizado correctamente.',
	'configuracion-guardada': 'Configuración guardada correctamente.',
	'recordatorio-enviado': 'Recordatorio enviado correctamente.',
	'cliente-desactivado': 'Cliente desactivado correctamente.',
	'cliente-activado': 'Cliente activado correctamente.'
};

/**
 * @param {string | null | undefined} clave
 */
export function obtenerMensajeExito(clave) {
	if (!clave) {
		return null;
	}

	return MENSAJES_EXITO[clave] ?? null;
}

/**
 * @param {unknown} err
 */
function extraerDetalleError(err) {
	if (err === null || err === undefined) {
		return { mensaje: 'Error desconocido' };
	}

	if (typeof err !== 'object') {
		return { mensaje: String(err) };
	}

	/** @type {Record<string, unknown>} */
	const objeto = err instanceof Error ? { ...err, ...Object.fromEntries(Object.getOwnPropertyNames(err).map((k) => [k, /** @type {Record<string, unknown>} */ (err)[k]])) } : /** @type {Record<string, unknown>} */ (err);

	/** @type {Record<string, unknown>} */
	const detalle = {};

	if (objeto.message !== undefined) detalle.message = objeto.message;
	if (objeto.name !== undefined) detalle.name = objeto.name;
	if (objeto.statusCode !== undefined) detalle.statusCode = objeto.statusCode;
	if (objeto.response !== undefined) detalle.response = objeto.response;
	if (objeto.cause !== undefined) detalle.cause = objeto.cause;

	if (err instanceof Error) {
		if (!detalle.message) detalle.message = err.message;
		if (!detalle.name) detalle.name = err.name;
		if (!detalle.cause && err.cause !== undefined) detalle.cause = err.cause;
	}

	if (Object.keys(detalle).length === 0) {
		detalle.mensaje = JSON.stringify(objeto);
	}

	return detalle;
}

/**
 * @param {'error' | 'warn' | 'info'} nivel
 * @param {string} contexto
 * @param {unknown} err
 * @param {Record<string, unknown>} [extra]
 */
function registrar(nivel, contexto, err, extra = {}) {
	const entrada = {
		nivel,
		timestamp: new Date().toISOString(),
		contexto,
		...extraerDetalleError(err),
		...extra
	};

	const linea = JSON.stringify(entrada);

	if (nivel === 'error') {
		console.error(linea);
	} else if (nivel === 'warn') {
		console.warn(linea);
	} else {
		console.info(linea);
	}
}

export const logger = {
	/**
	 * @param {string} contexto
	 * @param {unknown} err
	 * @param {Record<string, unknown>} [extra]
	 */
	error(contexto, err, extra) {
		registrar('error', contexto, err, extra);
	},

	/**
	 * @param {string} contexto
	 * @param {unknown} err
	 * @param {Record<string, unknown>} [extra]
	 */
	prisma(contexto, err, extra) {
		registrar('error', `prisma:${contexto}`, err, { tipo: 'prisma', ...extra });
	},

	/**
	 * @param {string} contexto
	 * @param {unknown} err
	 * @param {Record<string, unknown>} [extra]
	 */
	resend(contexto, err, extra) {
		registrar('error', `resend:${contexto}`, err, { tipo: 'resend', ...extra });
	},

	/**
	 * @param {string} contexto
	 * @param {unknown} err
	 * @param {Record<string, unknown>} [extra]
	 */
	pdf(contexto, err, extra) {
		registrar('error', `pdf:${contexto}`, err, { tipo: 'pdf', ...extra });
	},

	/**
	 * @param {string} contexto
	 * @param {string} mensaje
	 * @param {Record<string, unknown>} [extra]
	 */
	warn(contexto, mensaje, extra) {
		registrar('warn', contexto, mensaje, extra);
	}
};

export const REGISTROS_POR_PAGINA = 20;

/**
 * @param {URL} url
 * @param {string} [ordenDefault]
 * @param {'asc' | 'desc'} [direccionDefault]
 */
export function parsearListado(url, ordenDefault = 'createdAt', direccionDefault = 'desc') {
	const pagina = Math.max(1, Number.parseInt(url.searchParams.get('page') ?? '1', 10) || 1);
	const orden = url.searchParams.get('orden') ?? ordenDefault;
	const direccion =
		url.searchParams.get('dir') === 'asc'
			? 'asc'
			: url.searchParams.get('dir') === 'desc'
				? 'desc'
				: direccionDefault;

	return {
		pagina,
		orden,
		direccion,
		skip: (pagina - 1) * REGISTROS_POR_PAGINA,
		take: REGISTROS_POR_PAGINA,
		q: url.searchParams.get('q')?.trim() ?? '',
		estado: url.searchParams.get('estado')?.trim() ?? '',
		metodo: url.searchParams.get('metodo')?.trim() ?? '',
		desde: url.searchParams.get('desde')?.trim() ?? '',
		hasta: url.searchParams.get('hasta')?.trim() ?? ''
	};
}

/**
 * @param {number} total
 * @param {number} pagina
 */
export function calcularPaginacion(total, pagina) {
	const totalPaginas = Math.max(1, Math.ceil(total / REGISTROS_POR_PAGINA));
	const paginaActual = Math.min(pagina, totalPaginas);

	return {
		total,
		totalPaginas,
		pagina: paginaActual,
		porPagina: REGISTROS_POR_PAGINA,
		desde: total === 0 ? 0 : (paginaActual - 1) * REGISTROS_POR_PAGINA + 1,
		hasta: Math.min(paginaActual * REGISTROS_POR_PAGINA, total)
	};
}

/**
 * @param {string} pathname
 * @param {Record<string, string | number | undefined | null>} params
 */
export function construirUrlListado(pathname, params) {
	const search = new URLSearchParams();

	for (const [clave, valor] of Object.entries(params)) {
		if (valor !== undefined && valor !== null && String(valor).trim() !== '') {
			search.set(clave, String(valor));
		}
	}

	const query = search.toString();
	return query ? `${pathname}?${query}` : pathname;
}

/**
 * @param {string} pathname
 * @param {Record<string, string | number | undefined | null>} params
 * @param {string} columna
 */
export function construirUrlOrden(pathname, params, columna) {
	const direccionActual = params.dir === 'asc' ? 'asc' : 'desc';
	const esMismaColumna = params.orden === columna;
	const nuevaDireccion = esMismaColumna && direccionActual === 'asc' ? 'desc' : 'asc';

	return construirUrlListado(pathname, {
		...params,
		orden: columna,
		dir: nuevaDireccion,
		page: 1
	});
}

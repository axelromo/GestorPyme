/** Rutas accesibles sin autenticación */
const PUBLIC_ROUTE_PREFIXES = ['/sign-in'];

/**
 * @param {string} pathname
 * @returns {boolean}
 */
export function isPublicRoute(pathname) {
	if (pathname === '/') {
		return true;
	}

	return PUBLIC_ROUTE_PREFIXES.some(
		(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
	);
}

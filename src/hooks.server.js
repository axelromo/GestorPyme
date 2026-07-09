import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';
import { withClerkHandler } from 'svelte-clerk/server';
import { isPublicRoute } from '$lib/auth.js';
import { logger } from '$lib/server/logger.js';

/** @type {import('@sveltejs/kit').Handle} */
const protectRoutes = async ({ event, resolve }) => {
	if (!isPublicRoute(event.url.pathname)) {
		const { userId } = event.locals.auth();

		if (!userId) {
			redirect(307, '/sign-in');
		}
	}

	return resolve(event);
};

export const handle = sequence(withClerkHandler(), protectRoutes);

/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error: err, event, status }) {
	logger.error('sveltekit:handleError', err, {
		status,
		path: event.url.pathname
	});

	if (status === 404) {
		return { message: 'La página que buscas no existe.' };
	}

	if (status === 403) {
		return { message: 'No tienes permiso para acceder a este recurso.' };
	}

	return { message: 'Ocurrió un error inesperado. Intenta nuevamente más tarde.' };
}

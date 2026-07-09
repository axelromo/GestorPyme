import { redirect } from '@sveltejs/kit';
import { clerkClient } from 'svelte-clerk/server';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
	const { userId } = locals.auth();

	if (!userId) {
		redirect(307, '/sign-in');
	}

	const user = await clerkClient.users.getUser(userId);
	const nombre = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();

	return {
		user: {
			nombre: nombre || 'Usuario',
			email: user.emailAddresses[0]?.emailAddress ?? '',
			imageUrl: user.imageUrl ?? ''
		}
	};
}

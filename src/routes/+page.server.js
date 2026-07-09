import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export function load({ locals }) {
	const { userId } = locals.auth();

	if (userId) {
		redirect(307, '/dashboard');
	}

	redirect(307, '/sign-in');
}

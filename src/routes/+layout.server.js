import { buildClerkProps } from 'svelte-clerk/server';

/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
	return {
		...buildClerkProps(locals.auth())
	};
}

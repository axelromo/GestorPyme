<script>
	import favicon from '$lib/assets/favicon.svg';
	import { ClerkProvider } from 'svelte-clerk';
	import '$lib/styles/global.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ClerkProvider>
	{@render children()}
</ClerkProvider>

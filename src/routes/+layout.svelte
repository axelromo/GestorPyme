<script>
	import favicon from '$lib/assets/favicon.svg';
	import { ClerkProvider } from 'svelte-clerk';
	import '$lib/styles/global.css';

	let { children } = $props();

	const metaDescription =
		'GestorPyme — Sistema integral para administrar clientes, cotizaciones, pagos y cobranza de tu PYME.';
</script>

<svelte:head>
	<title>GestorPyme — Gestión para PYMEs</title>
	<meta name="description" content={metaDescription} />
	<meta name="theme-color" content="#2563eb" />
	<link rel="icon" href={favicon} type="image/svg+xml" />
	<link rel="apple-touch-icon" href={favicon} />
</svelte:head>

<ClerkProvider>
	{@render children()}
</ClerkProvider>

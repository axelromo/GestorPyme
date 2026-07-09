<script>
	import { page } from '$app/state';
	import AppLayout from '$lib/components/layout/AppLayout.svelte';

	let { data, children } = $props();

	/** @type {Record<string, string>} */
	const titulosPorRuta = {
		'/dashboard': 'Dashboard',
		'/clientes': 'Clientes',
		'/cotizaciones': 'Cotizaciones',
		'/pagos': 'Pagos',
		'/cobranza': 'Cobranza',
		'/configuracion': 'Configuración'
	};

	const tituloPagina = $derived.by(() => {
		const pathname = page.url.pathname;
		for (const [ruta, titulo] of Object.entries(titulosPorRuta)) {
			if (pathname === ruta || pathname.startsWith(`${ruta}/`)) {
				return titulo;
			}
		}
		return 'GestorPyme';
	});

	const metaDescription =
		'Panel de gestión GestorPyme: clientes, cotizaciones, pagos y cobranza en un solo lugar.';
</script>

<svelte:head>
	<title>{tituloPagina} · GestorPyme</title>
	<meta name="description" content={metaDescription} />
</svelte:head>

<AppLayout user={data.user} {children} />

<script>
	import { ETIQUETAS_ESTADO } from '$lib/cotizaciones/estado.js';

	/** @type {{ estado: string }} */
	let { estado } = $props();
</script>

<span class="badge badge-{estado.toLowerCase()}">{ETIQUETAS_ESTADO[estado] ?? estado}</span>

<style>
	.badge {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.badge-borrador {
		background: #f1f5f9;
		color: #475569;
	}

	.badge-enviada {
		background: #dbeafe;
		color: #1d4ed8;
	}

	.badge-aprobada {
		background: #dcfce7;
		color: #166534;
	}

	.badge-rechazada {
		background: #fee2e2;
		color: #991b1b;
	}

	.badge-facturada {
		background: #ede9fe;
		color: #5b21b6;
	}

	.badge-pagada {
		background: #ccfbf1;
		color: #0f766e;
	}
</style>

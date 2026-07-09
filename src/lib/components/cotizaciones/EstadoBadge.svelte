<script>
	import { ETIQUETAS_ESTADO } from '$lib/cotizaciones/estado.js';

	/** @type {{ estado: string }} */
	let { estado } = $props();
</script>

<span class="badge badge-{estado.toLowerCase()}">{ETIQUETAS_ESTADO[estado] ?? estado}</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		white-space: nowrap;
		letter-spacing: 0.01em;
	}

	.badge-borrador {
		background: #f1f5f9;
		color: #475569;
	}

	.badge-enviada {
		background: var(--color-primary-soft);
		color: #1d4ed8;
	}

	.badge-aprobada {
		background: var(--color-success-soft);
		color: #166534;
	}

	.badge-rechazada {
		background: var(--color-danger-soft);
		color: #991b1b;
	}

	.badge-facturada {
		background: #ede9fe;
		color: #6d28d9;
	}

	.badge-pagada {
		background: #d1fae5;
		color: #065f46;
	}
</style>

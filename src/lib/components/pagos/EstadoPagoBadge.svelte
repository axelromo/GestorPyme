<script>
	/** @type {{ estado: string }} */
	let { estado } = $props();
</script>

<span class="badge badge-{estado.toLowerCase()}">{estado}</span>

<style>
	.badge {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.badge-pagado {
		background: #ccfbf1;
		color: #0f766e;
	}

	.badge-parcial {
		background: #fef3c7;
		color: #b45309;
	}

	.badge-pendiente {
		background: #f1f5f9;
		color: #475569;
	}
</style>

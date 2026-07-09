<script>
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { Chart, registerables } from 'chart.js';

	Chart.register(...registerables);

	/**
	 * @type {{
	 *   titulo: string,
	 *   tipo: 'bar' | 'doughnut',
	 *   labels: string[],
	 *   data: number[],
	 *   colores?: string[]
	 * }}
	 */
	let { titulo, tipo, labels, data, colores = [] } = $props();

	/** @type {HTMLCanvasElement | null} */
	let canvas = $state(null);

	/** @type {Chart | null} */
	let grafica = null;

	const COLORES_ESTADO = ['#64748B', '#2563EB', '#16A34A', '#DC2626', '#7C3AED', '#0D9488'];

	const coloresGrafica = $derived(colores.length > 0 ? colores : COLORES_ESTADO);

	function destruirGrafica() {
		if (grafica) {
			grafica.destroy();
			grafica = null;
		}
	}

	$effect(() => {
		if (!browser || !canvas) {
			return undefined;
		}

		const elemento = canvas;
		const etiquetas = labels;
		const valores = data;
		const paleta = coloresGrafica;

		destruirGrafica();

		const instancia = new Chart(elemento, {
			type: tipo,
			data: {
				labels: etiquetas,
				datasets: [
					{
						label: titulo,
						data: valores,
						backgroundColor: tipo === 'doughnut' ? paleta : 'rgba(37, 99, 235, 0.85)',
						borderColor: tipo === 'doughnut' ? '#ffffff' : 'rgba(30, 58, 138, 0.9)',
						borderWidth: tipo === 'doughnut' ? 2 : 1,
						borderRadius: tipo === 'bar' ? 6 : 0
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: tipo === 'doughnut',
						position: 'bottom',
						labels: {
							padding: 16,
							usePointStyle: true,
							font: { family: 'Inter, sans-serif', size: 12 }
						}
					}
				},
				scales:
					tipo === 'bar'
						? {
								x: {
									grid: { display: false },
									ticks: { font: { family: 'Inter, sans-serif', size: 11 } }
								},
								y: {
									beginAtZero: true,
									ticks: { precision: 0, font: { family: 'Inter, sans-serif', size: 11 } },
									grid: { color: '#f1f5f9' }
								}
							}
						: undefined
			}
		});

		grafica = instancia;

		return () => {
			instancia.destroy();
			if (grafica === instancia) {
				grafica = null;
			}
		};
	});

	onDestroy(destruirGrafica);
</script>

<article class="chart-card">
	<h2>{titulo}</h2>
	<div class="chart-wrapper">
		{#if browser}
			<canvas bind:this={canvas} aria-label={titulo}></canvas>
		{/if}
	</div>
</article>

<style>
	.chart-card {
		padding: 1.5rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-card);
		box-shadow: var(--shadow-sm);
		transition: box-shadow var(--transition);
	}

	.chart-card:hover {
		box-shadow: var(--shadow-md);
	}

	h2 {
		margin: 0 0 1rem;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text, #0f172a);
	}

	.chart-wrapper {
		position: relative;
		height: 18rem;
	}
</style>

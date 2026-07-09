<script>
	import { enhance } from '$app/forms';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { formatearMoneda } from '$lib/cotizaciones/calculos.js';
	import { ETIQUETAS_ESTADO } from '$lib/cotizaciones/estado.js';

	/**
	 * @type {{
	 *   filas: Array<{
	 *     id: string,
	 *     folio: string,
	 *     estado: string,
	 *     clienteNombre: string,
	 *     clienteEmail: string,
	 *     total: number,
	 *     pagado: number,
	 *     saldo: number,
	 *     diasTranscurridos: number
	 *   }>
	 * }}
	 */
	let { filas } = $props();

	/** @type {string | null} */
	let enviandoId = $state(null);
</script>

<div class="table-wrapper">
	<table class="table">
		<thead>
			<tr>
				<th>Cliente</th>
				<th>Folio</th>
				<th>Estado</th>
				<th>Total</th>
				<th>Pagado</th>
				<th>Saldo</th>
				<th>Días</th>
				<th>Acciones</th>
			</tr>
		</thead>
		<tbody>
			{#each filas as fila (fila.id)}
				<tr>
					<td>{fila.clienteNombre}</td>
					<td>
						<a class="folio-link" href="/cotizaciones/{fila.id}">{fila.folio}</a>
					</td>
					<td>
						<Badge tone={fila.estado === 'FACTURADA' ? 'warning' : 'info'}>
							{ETIQUETAS_ESTADO[fila.estado] ?? fila.estado}
						</Badge>
					</td>
					<td>{formatearMoneda(fila.total)}</td>
					<td>{formatearMoneda(fila.pagado)}</td>
					<td class="saldo">{formatearMoneda(fila.saldo)}</td>
					<td>{fila.diasTranscurridos}</td>
					<td class="acciones">
						<form
							method="POST"
							action="?/recordatorio"
							use:enhance={() => {
								enviandoId = fila.id;
								return async ({ update }) => {
									await update();
									enviandoId = null;
								};
							}}
						>
							<input type="hidden" name="id" value={fila.id} />
							<Button
								type="submit"
								variant="success"
								loading={enviandoId === fila.id}
								disabled={!fila.clienteEmail?.trim()}
								title={fila.clienteEmail?.trim()
									? `Enviar a ${fila.clienteEmail}`
									: 'El cliente no tiene correo'}
							>
								Enviar recordatorio
							</Button>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.table-wrapper {
		overflow-x: auto;
	}

	.acciones {
		white-space: nowrap;
	}
</style>

<script>
	import { enhance } from '$app/forms';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import MobileDataCard from '$lib/components/ui/MobileDataCard.svelte';
	import MobileDataRow from '$lib/components/ui/MobileDataRow.svelte';
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

<div class="table-wrapper table-desktop">
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

<div class="mobile-card-list">
	{#each filas as fila (fila.id)}
		<MobileDataCard>
			{#snippet children()}
				<MobileDataRow label="Cliente">{fila.clienteNombre}</MobileDataRow>
				<MobileDataRow label="Folio">
					<a class="folio-link" href="/cotizaciones/{fila.id}">{fila.folio}</a>
				</MobileDataRow>
				<MobileDataRow label="Estado">
					<Badge tone={fila.estado === 'FACTURADA' ? 'warning' : 'info'}>
						{ETIQUETAS_ESTADO[fila.estado] ?? fila.estado}
					</Badge>
				</MobileDataRow>
				<MobileDataRow label="Total">{formatearMoneda(fila.total)}</MobileDataRow>
				<MobileDataRow label="Pagado">{formatearMoneda(fila.pagado)}</MobileDataRow>
				<MobileDataRow label="Saldo" highlight={fila.saldo > 0}>
					{formatearMoneda(fila.saldo)}
				</MobileDataRow>
				<MobileDataRow label="Días">{fila.diasTranscurridos}</MobileDataRow>
			{/snippet}
			{#snippet actions()}
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
			{/snippet}
		</MobileDataCard>
	{/each}
</div>

<style>
	.table-wrapper {
		overflow-x: auto;
	}

	.acciones {
		white-space: nowrap;
	}

	.folio-link {
		color: var(--color-primary);
		font-weight: 600;
		text-decoration: none;
	}

	.folio-link:hover {
		text-decoration: underline;
	}
</style>

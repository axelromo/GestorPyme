<script>
	/**
	 * @type {{
	 *   titulo: string,
	 *   columnas: Array<{ clave: string, etiqueta: string, alineacion?: 'left' | 'right' }>,
	 *   filas: Array<Record<string, string>>,
	 *   vacio?: string
	 * }}
	 */
	let { titulo, columnas, filas, vacio = 'Sin datos' } = $props();
</script>

<article class="widget">
	<h2>{titulo}</h2>
	{#if filas.length === 0}
		<p class="vacio">{vacio}</p>
	{:else}
		<div class="table-wrapper">
			<table>
				<thead>
					<tr>
						{#each columnas as columna (columna.clave)}
							<th class:align-right={columna.alineacion === 'right'}>{columna.etiqueta}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each filas as fila, indice (indice)}
						<tr>
							{#each columnas as columna (columna.clave)}
								<td class:align-right={columna.alineacion === 'right'}>
									{#if fila[`${columna.clave}Href`]}
										<a href={fila[`${columna.clave}Href`]}>{fila[columna.clave]}</a>
									{:else}
										{fila[columna.clave]}
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</article>

<style>
	.widget {
		padding: 1.25rem;
		background: #ffffff;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.75rem;
		box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
	}

	h2 {
		margin: 0 0 1rem;
		font-size: 1rem;
		font-weight: 600;
	}

	.vacio {
		margin: 0;
		color: var(--color-text-muted, #64748b);
		font-size: 0.875rem;
	}

	.table-wrapper {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	th,
	td {
		padding: 0.625rem 0.5rem;
		text-align: left;
		border-bottom: 1px solid var(--color-border, #e2e8f0);
	}

	th {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text-muted, #64748b);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	tr:last-child td {
		border-bottom: none;
	}

	.align-right,
	td.align-right,
	th.align-right {
		text-align: right;
	}

	a {
		color: var(--color-primary, #2563eb);
		font-weight: 600;
		text-decoration: none;
	}
</style>

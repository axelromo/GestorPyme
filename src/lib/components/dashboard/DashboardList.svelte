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
			<table class="table">
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
		padding: 1.5rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-card);
		box-shadow: var(--shadow-sm);
		transition: box-shadow var(--transition);
	}

	.widget:hover {
		box-shadow: var(--shadow-md);
	}

	h2 {
		margin: 0 0 1.25rem;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.vacio {
		margin: 0;
		color: var(--color-text-muted);
		font-size: 0.875rem;
	}

	.align-right,
	td.align-right,
	th.align-right {
		text-align: right;
	}
</style>

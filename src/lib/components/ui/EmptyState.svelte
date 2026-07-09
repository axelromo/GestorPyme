<script>
	/** @type {{ titulo: string, mensaje: string, icono?: string, children?: import('svelte').Snippet }} */
	let { titulo, mensaje, icono = '', children } = $props();

	const esClientes = $derived(/cliente/i.test(titulo));
	const esCotizaciones = $derived(/cotizaci/i.test(titulo));
	const esPagos = $derived(/pago/i.test(titulo));
	const esDatos = $derived(/datos/i.test(titulo));
	const esCobranza = $derived(/cobrar|cuentas/i.test(titulo));
</script>

<div class="empty-state">
	<div class="illustration" aria-hidden="true">
		{#if esClientes}
			<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
				<circle cx="60" cy="60" r="50" fill="#EFF6FF" />
				<circle cx="60" cy="48" r="14" fill="#2563EB" opacity="0.85" />
				<path d="M35 88c0-14 11-22 25-22s25 8 25 22" stroke="#2563EB" stroke-width="4" stroke-linecap="round" />
			</svg>
		{:else if esCotizaciones}
			<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect x="28" y="22" width="64" height="76" rx="8" fill="#EFF6FF" />
				<rect x="38" y="38" width="44" height="4" rx="2" fill="#2563EB" opacity="0.5" />
				<rect x="38" y="50" width="36" height="4" rx="2" fill="#2563EB" opacity="0.35" />
				<rect x="38" y="62" width="40" height="4" rx="2" fill="#2563EB" opacity="0.35" />
			</svg>
		{:else if esPagos}
			<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect x="22" y="38" width="76" height="48" rx="8" fill="#EFF6FF" />
				<rect x="22" y="48" width="76" height="12" fill="#2563EB" opacity="0.2" />
				<rect x="32" y="72" width="24" height="6" rx="3" fill="#2563EB" opacity="0.5" />
			</svg>
		{:else if esCobranza}
			<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
				<circle cx="60" cy="60" r="44" fill="#DCFCE7" />
				<path d="M42 62l12 12 26-28" stroke="#16A34A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		{:else if esDatos}
			<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect x="24" y="70" width="16" height="28" rx="4" fill="#2563EB" opacity="0.35" />
				<rect x="52" y="50" width="16" height="48" rx="4" fill="#2563EB" opacity="0.6" />
				<rect x="80" y="34" width="16" height="64" rx="4" fill="#2563EB" />
			</svg>
		{:else}
			<span class="emoji-fallback">{icono || '📭'}</span>
		{/if}
	</div>
	<h2>{titulo}</h2>
	<p>{mensaje}</p>
	{#if children}
		<div class="actions">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.empty-state {
		padding: 3rem 1.5rem;
		text-align: center;
		background: var(--color-surface);
		border: 1px dashed var(--color-border);
		border-radius: var(--radius-card);
		box-shadow: var(--shadow-sm);
	}

	.illustration {
		display: flex;
		justify-content: center;
		margin-bottom: 1.25rem;
	}

	.illustration svg {
		width: 6rem;
		height: 6rem;
	}

	.emoji-fallback {
		font-size: 3rem;
	}

	h2 {
		margin: 0 0 0.5rem;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-text);
	}

	p {
		margin: 0;
		max-width: 28rem;
		margin-inline: auto;
		color: var(--color-text-muted);
		font-size: 0.875rem;
		line-height: 1.6;
	}

	.actions {
		display: flex;
		justify-content: center;
		gap: 0.75rem;
		margin-top: 1.5rem;
		flex-wrap: wrap;
	}
</style>

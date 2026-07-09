<script>
	import { page } from '$app/state';

	/** @type {{ open: boolean, onClose: () => void }} */
	let { open = false, onClose = () => {} } = $props();

	const navItems = [
		{ href: '/dashboard', label: 'Dashboard' },
		{ href: '/clientes', label: 'Clientes' },
		{ href: '/cotizaciones', label: 'Cotizaciones' },
		{ href: '/pagos', label: 'Pagos' },
		{ href: '/cobranza', label: 'Cobranza' },
		{ href: '/configuracion', label: 'Configuración' }
	];

	$effect(() => {
		page.url.pathname;
		if (open) {
			onClose();
		}
	});

	/**
	 * @param {string} href
	 */
	function isActive(href) {
		return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
	}
</script>

<aside class="sidebar" class:open aria-label="Navegación principal">
	<div class="sidebar-header">
		<span class="brand">GestorPyme</span>
		<button type="button" class="close-btn" aria-label="Cerrar menú" onclick={onClose}>×</button>
	</div>

	<nav class="sidebar-nav">
		<ul>
			{#each navItems as item (item.href)}
				<li>
					<a href={item.href} class:active={isActive(item.href)}>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</aside>

<style>
	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 40;
		display: flex;
		flex-direction: column;
		width: var(--sidebar-width);
		height: 100dvh;
		background: var(--color-sidebar);
		border-right: 1px solid var(--color-border);
		transform: translateX(-100%);
		transition: transform 0.2s ease;
	}

	.sidebar.open {
		transform: translateX(0);
	}

	.sidebar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--color-border);
	}

	.brand {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-text);
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border: none;
		border-radius: 0.375rem;
		background: transparent;
		color: var(--color-text-muted);
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
	}

	.close-btn:hover {
		background: var(--color-surface-hover);
	}

	.sidebar-nav ul {
		list-style: none;
		margin: 0;
		padding: 0.75rem;
	}

	.sidebar-nav a {
		display: block;
		padding: 0.625rem 0.875rem;
		border-radius: 0.375rem;
		color: var(--color-text-muted);
		text-decoration: none;
		font-size: 0.9375rem;
		font-weight: 500;
		transition:
			background 0.15s ease,
			color 0.15s ease;
	}

	.sidebar-nav a:hover {
		background: var(--color-surface-hover);
		color: var(--color-text);
	}

	.sidebar-nav a.active {
		background: var(--color-primary-soft);
		color: var(--color-primary);
	}

	@media (min-width: 768px) {
		.sidebar {
			transform: translateX(0);
		}

		.close-btn {
			display: none;
		}
	}
</style>

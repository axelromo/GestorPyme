<script>
	import { page } from '$app/state';
	import { SignOutButton } from 'svelte-clerk';
	import { NAV_ICONS } from './nav-icons.js';

	/** @type {{ open: boolean, onClose: () => void, nombreEmpresa?: string | null }} */
	let { open = false, onClose = () => {}, nombreEmpresa = null } = $props();

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
	<div class="sidebar-brand">
		<div class="logo" aria-hidden="true">
			<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect width="32" height="32" rx="8" fill="#2563EB" />
				<path
					d="M8 22V10h4.2l3.4 7.2L19 10h4v12h-3.2v-7.4L15.8 22h-2.6L10.2 14.6V22H8Z"
					fill="white"
				/>
			</svg>
		</div>
		<div class="brand-text">
			<span class="brand-name">GestorPyme</span>
			<span class="brand-sub">{nombreEmpresa?.trim() || 'Panel de gestión'}</span>
		</div>
		<button type="button" class="close-btn" aria-label="Cerrar menú" onclick={onClose}>×</button>
	</div>

	<nav class="sidebar-nav">
		<ul>
			{#each navItems as item (item.href)}
				<li>
					<a href={item.href} class:active={isActive(item.href)}>
						<span class="nav-icon">{@html NAV_ICONS[item.href]}</span>
						<span class="nav-label">{item.label}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<div class="sidebar-footer">
		<SignOutButton class="sidebar-sign-out" redirectUrl="/sign-in">
			<span class="nav-icon" aria-hidden="true">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
				</svg>
			</span>
			<span class="nav-label">Cerrar sesión</span>
		</SignOutButton>
	</div>
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
		border-right: 1px solid rgba(255, 255, 255, 0.06);
		transform: translateX(-100%);
		transition: transform var(--transition) cubic-bezier(0.4, 0, 0.2, 1);
		will-change: transform;
	}

	.sidebar.open {
		transform: translateX(0);
		box-shadow: 8px 0 32px rgba(15, 23, 42, 0.25);
	}

	.sidebar-brand {
		display: flex;
		align-items: center;
		gap: 0.875rem;
		padding: 1.25rem 1.25rem 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.logo {
		flex-shrink: 0;
		width: 2.25rem;
		height: 2.25rem;
	}

	.logo svg {
		width: 100%;
		height: 100%;
	}

	.brand-text {
		display: flex;
		flex-direction: column;
		min-width: 0;
		flex: 1;
	}

	.brand-name {
		font-size: 1.0625rem;
		font-weight: 700;
		color: #ffffff;
		letter-spacing: -0.02em;
	}

	.brand-sub {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.55);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border: none;
		border-radius: var(--radius-sm);
		background: transparent;
		color: rgba(255, 255, 255, 0.6);
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		transition: background var(--transition);
	}

	.close-btn:hover {
		background: var(--color-sidebar-hover);
		color: #ffffff;
	}

	.sidebar-nav {
		flex: 1;
		padding: 1rem 0.75rem;
		overflow-y: auto;
	}

	.sidebar-nav ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.sidebar-nav a {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border-radius: var(--radius-sm);
		color: rgba(255, 255, 255, 0.65);
		text-decoration: none;
		font-size: 0.9375rem;
		font-weight: 500;
		transition:
			background var(--transition),
			color var(--transition);
	}

	.sidebar-nav a:hover {
		background: var(--color-sidebar-hover);
		color: #ffffff;
	}

	.sidebar-nav a.active {
		background: var(--color-sidebar-active);
		color: #ffffff;
		box-shadow: inset 3px 0 0 var(--color-primary);
	}

	.nav-icon {
		display: flex;
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	.nav-icon :global(svg) {
		width: 100%;
		height: 100%;
	}

	.sidebar-footer {
		padding: 0.75rem;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	:global(.sidebar-sign-out) {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.75rem 1rem;
		border: none;
		border-radius: var(--radius-sm);
		background: transparent;
		color: rgba(255, 255, 255, 0.65);
		font-size: 0.9375rem;
		font-weight: 500;
		font-family: inherit;
		text-align: left;
		cursor: pointer;
		transition:
			background var(--transition),
			color var(--transition);
	}

	:global(.sidebar-sign-out:hover) {
		background: var(--color-sidebar-hover);
		color: #ffffff;
	}

	:global(.sidebar-sign-out:focus-visible) {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	.sidebar-nav a:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	.close-btn:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	@media (min-width: 768px) {
		.sidebar {
			transform: translateX(0);
			box-shadow: none;
		}

		.close-btn {
			display: none;
		}

		.sidebar-footer {
			display: none;
		}
	}
</style>

<script>
	import { page } from '$app/state';
	import Sidebar from './Sidebar.svelte';
	import Navbar from './Navbar.svelte';
	import AppFooter from './AppFooter.svelte';

	/**
	 * @type {{
	 *   user: { nombre: string, email: string, imageUrl: string },
	 *   nombreEmpresa?: string | null,
	 *   children: import('svelte').Snippet
	 * }}
	 */
	let { user, nombreEmpresa = null, children } = $props();

	let sidebarOpen = $state(false);

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function closeSidebar() {
		sidebarOpen = false;
	}
</script>

<div class="app-shell">
	<Sidebar open={sidebarOpen} onClose={closeSidebar} {nombreEmpresa} />

	{#if sidebarOpen}
		<button
			type="button"
			class="overlay overlay-visible"
			aria-label="Cerrar menú de navegación"
			onclick={closeSidebar}
		></button>
	{/if}

	<div class="app-main">
		<Navbar {user} {nombreEmpresa} onMenuToggle={toggleSidebar} />

		{#key page.url.pathname}
			<main class="app-content page-enter" id="contenido-principal">
				{@render children()}
				<AppFooter />
			</main>
		{/key}
	</div>
</div>

<style>
	.app-shell {
		min-height: 100dvh;
		background: var(--color-background);
		overflow-x: hidden;
		max-width: 100vw;
	}

	.overlay {
		position: fixed;
		inset: 0;
		z-index: 30;
		border: none;
		padding: 0;
		background: rgba(15, 23, 42, 0.45);
		backdrop-filter: blur(3px);
		cursor: pointer;
		animation: overlay-in var(--transition) ease;
	}

	@keyframes overlay-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.app-main {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		min-width: 0;
		overflow-x: hidden;
	}

	.app-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 0.875rem 0.75rem 0.5rem;
		max-width: 90rem;
		width: 100%;
		margin: 0 auto;
		min-width: 0;
		overflow-x: hidden;
	}

	.page-enter {
		animation: page-enter var(--transition) ease;
	}

	@keyframes page-enter {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (min-width: 768px) {
		.app-main {
			margin-left: var(--sidebar-width);
		}

		.overlay {
			display: none;
		}

		.app-content {
			padding: 1.5rem 1.75rem 0.75rem;
		}
	}

	@media (min-width: 1440px) {
		.app-content {
			padding: 1.75rem 2.5rem 1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.page-enter,
		.overlay {
			animation: none;
		}
	}
</style>

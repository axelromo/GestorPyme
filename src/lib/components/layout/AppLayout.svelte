<script>
	import Sidebar from './Sidebar.svelte';
	import Navbar from './Navbar.svelte';

	/**
	 * @type {{
	 *   user: { nombre: string, email: string, imageUrl: string },
	 *   children: import('svelte').Snippet
	 * }}
	 */
	let { user, children } = $props();

	let sidebarOpen = $state(false);

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function closeSidebar() {
		sidebarOpen = false;
	}
</script>

<div class="app-shell">
	<Sidebar open={sidebarOpen} onClose={closeSidebar} />

	{#if sidebarOpen}
		<button type="button" class="overlay" aria-label="Cerrar menú" onclick={closeSidebar}></button>
	{/if}

	<div class="app-main">
		<Navbar {user} onMenuToggle={toggleSidebar} />

		<main class="app-content">
			{@render children()}
		</main>
	</div>
</div>

<style>
	:global(:root) {
		--sidebar-width: 16rem;
		--navbar-height: 3.5rem;
		--color-sidebar: #f8fafc;
		--color-surface: #ffffff;
		--color-surface-hover: #f1f5f9;
		--color-border: #e2e8f0;
		--color-text: #0f172a;
		--color-text-muted: #64748b;
		--color-primary: #2563eb;
		--color-primary-soft: #eff6ff;
	}

	.app-shell {
		min-height: 100dvh;
		background: #f1f5f9;
	}

	.overlay {
		position: fixed;
		inset: 0;
		z-index: 30;
		border: none;
		padding: 0;
		background: rgba(15, 23, 42, 0.4);
		cursor: pointer;
	}

	.app-main {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
	}

	.app-content {
		flex: 1;
		padding: 1.5rem 1rem;
	}

	@media (min-width: 768px) {
		.app-main {
			margin-left: var(--sidebar-width);
		}

		.overlay {
			display: none;
		}

		.app-content {
			padding: 1.5rem;
		}
	}
</style>

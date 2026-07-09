<script>
	import Sidebar from './Sidebar.svelte';
	import Navbar from './Navbar.svelte';

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
		<button type="button" class="overlay" aria-label="Cerrar menú" onclick={closeSidebar}></button>
	{/if}

	<div class="app-main">
		<Navbar {user} {nombreEmpresa} onMenuToggle={toggleSidebar} />

		<main class="app-content">
			{@render children()}
		</main>
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
		background: rgba(15, 23, 42, 0.5);
		backdrop-filter: blur(2px);
		cursor: pointer;
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
		padding: 1rem 0.75rem;
		max-width: 90rem;
		width: 100%;
		margin: 0 auto;
		min-width: 0;
		overflow-x: hidden;
	}

	@media (min-width: 768px) {
		.app-main {
			margin-left: var(--sidebar-width);
		}

		.overlay {
			display: none;
		}

		.app-content {
			padding: 2rem 1.75rem;
		}
	}

	@media (min-width: 1440px) {
		.app-content {
			padding: 2rem 2.5rem;
		}
	}
</style>

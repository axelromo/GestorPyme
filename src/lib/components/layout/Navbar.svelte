<script>
	import { SignOutButton } from 'svelte-clerk';

	/**
	 * @type {{
	 *   user: { nombre: string, email: string, imageUrl: string },
	 *   onMenuToggle: () => void,
	 *   menuOpen?: boolean,
	 *   nombreEmpresa?: string | null
	 * }}
	 */
	let { user, onMenuToggle = () => {}, menuOpen = false, nombreEmpresa = null } = $props();
</script>

<header class="navbar" aria-label="Barra de navegación">
	<button
		type="button"
		class="menu-btn"
		aria-label="Abrir menú de navegación"
		aria-expanded={menuOpen}
		aria-controls="sidebar-drawer"
		onclick={onMenuToggle}
	>
		<span></span>
		<span></span>
		<span></span>
	</button>

	<div class="navbar-brand">
		<div class="logo" aria-hidden="true">
			<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect width="32" height="32" rx="8" fill="#2563EB" />
				<path
					d="M8 22V10h4.2l3.4 7.2L19 10h4v12h-3.2v-7.4L15.8 22h-2.6L10.2 14.6V22H8Z"
					fill="white"
				/>
			</svg>
		</div>
		<div class="navbar-start">
			<span class="navbar-title">GestorPyme</span>
			{#if nombreEmpresa?.trim()}
				<span class="navbar-empresa">{nombreEmpresa}</span>
			{/if}
		</div>
	</div>

	<div class="user-menu">
		{#if user.imageUrl}
			<img class="avatar" src={user.imageUrl} alt="Avatar de {user.nombre}" />
		{:else}
			<div class="avatar avatar-fallback" aria-hidden="true">
				{user.nombre.charAt(0).toUpperCase()}
			</div>
		{/if}

		<div class="user-info">
			<span class="user-name">{user.nombre}</span>
			<span class="user-email">{user.email}</span>
		</div>

		<SignOutButton class="sign-out-btn" redirectUrl="/sign-in">Cerrar sesión</SignOutButton>
	</div>
</header>

<style>
	.navbar {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 0.625rem;
		height: var(--navbar-height);
		padding: 0 0.875rem;
		background: rgba(255, 255, 255, 0.92);
		border-bottom: 1px solid var(--color-border);
		box-shadow: var(--shadow-navbar);
		backdrop-filter: blur(8px);
	}

	.menu-btn {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.25rem;
		width: 2.5rem;
		height: 2.5rem;
		padding: 0.5rem;
		border: none;
		border-radius: var(--radius-sm);
		background: transparent;
		cursor: pointer;
		transition: background var(--transition);
		flex-shrink: 0;
	}

	.menu-btn:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	.menu-btn span {
		display: block;
		width: 100%;
		height: 2px;
		background: var(--color-text);
		border-radius: 1px;
	}

	.menu-btn:hover {
		background: var(--color-surface-hover);
	}

	.menu-btn:active {
		transform: scale(0.96);
	}

	.navbar-brand {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		min-width: 0;
		flex: 1;
	}

	.logo {
		flex-shrink: 0;
		width: 2rem;
		height: 2rem;
	}

	.logo svg {
		width: 100%;
		height: 100%;
	}

	.navbar-start {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		min-width: 0;
	}

	.navbar-title {
		font-weight: 700;
		font-size: 0.9375rem;
		color: var(--color-text);
		letter-spacing: -0.02em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.navbar-empresa {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-text-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.user-menu {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-left: auto;
		min-width: 0;
		flex-shrink: 0;
	}

	.avatar {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		object-fit: cover;
		flex-shrink: 0;
		border: 2px solid var(--color-border);
	}

	.avatar-fallback {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-primary-soft);
		color: var(--color-primary);
		font-weight: 700;
		font-size: 0.8125rem;
	}

	.user-info {
		display: none;
		flex-direction: column;
		min-width: 0;
	}

	.user-name {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.user-email {
		font-size: 0.75rem;
		color: var(--color-text-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	:global(.sign-out-btn) {
		padding: 0.625rem 1rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		color: var(--color-text);
		font-size: 0.8125rem;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		white-space: nowrap;
		transition:
			background var(--transition),
			border-color var(--transition),
			transform var(--transition);
	}

	:global(.sign-out-btn:hover) {
		background: var(--color-surface-hover);
		border-color: #cbd5e1;
	}

	:global(.sign-out-btn:active) {
		transform: scale(0.98);
	}

	:global(.sign-out-btn:focus-visible) {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	@media (min-width: 768px) {
		.navbar {
			padding: 0 1.5rem;
			gap: 1rem;
		}

		.menu-btn {
			display: none;
		}

		.logo {
			width: 2.25rem;
			height: 2.25rem;
		}

		.navbar-title {
			font-size: 1rem;
		}

		.navbar-empresa {
			font-size: 0.8125rem;
		}

		.avatar {
			width: 2.5rem;
			height: 2.5rem;
		}

		.user-info {
			display: flex;
		}
	}

	@media (max-width: 767px) {
		.menu-btn {
			display: flex;
		}

		.navbar-empresa {
			display: none;
		}

		:global(.sign-out-btn) {
			display: none;
		}
	}
</style>

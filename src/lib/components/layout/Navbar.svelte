<script>
	import { SignOutButton } from 'svelte-clerk';

	/**
	 * @type {{
	 *   user: { nombre: string, email: string, imageUrl: string },
	 *   onMenuToggle: () => void,
	 *   nombreEmpresa?: string | null
	 * }}
	 */
	let { user, onMenuToggle = () => {}, nombreEmpresa = null } = $props();
</script>

<header class="navbar">
	<button type="button" class="menu-btn" aria-label="Abrir menú" onclick={onMenuToggle}>
		<span></span>
		<span></span>
		<span></span>
	</button>

	<div class="navbar-start">
		<span class="navbar-title">GestorPyme</span>
		{#if nombreEmpresa?.trim()}
			<span class="navbar-empresa">{nombreEmpresa}</span>
		{/if}
	</div>

	<div class="user-menu">
		{#if user.imageUrl}
			<img class="avatar" src={user.imageUrl} alt="" />
		{:else}
			<div class="avatar avatar-fallback" aria-hidden="true">
				{user.nombre.charAt(0).toUpperCase()}
			</div>
		{/if}

		<div class="user-info">
			<span class="user-name">{user.nombre}</span>
			<span class="user-email">{user.email}</span>
		</div>

		<SignOutButton class="sign-out-btn">Cerrar sesión</SignOutButton>
	</div>
</header>

<style>
	.navbar {
		display: flex;
		align-items: center;
		gap: 1rem;
		height: var(--navbar-height);
		padding: 0 1.5rem;
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
		box-shadow: var(--shadow-sm);
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
	}

	.menu-btn span {
		display: block;
		height: 2px;
		background: var(--color-text);
		border-radius: 1px;
	}

	.menu-btn:hover {
		background: var(--color-surface-hover);
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
		gap: 0.875rem;
		margin-left: auto;
		min-width: 0;
	}

	.avatar {
		width: 2.5rem;
		height: 2.5rem;
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
		font-size: 0.875rem;
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
			border-color var(--transition);
	}

	:global(.sign-out-btn:hover) {
		background: var(--color-surface-hover);
		border-color: #cbd5e1;
	}

	@media (min-width: 640px) {
		.user-info {
			display: flex;
		}
	}

	@media (min-width: 768px) {
		.menu-btn {
			display: none;
		}

		.navbar-title {
			display: none;
		}

		.navbar-empresa {
			font-size: 0.875rem;
			font-weight: 600;
			color: var(--color-text);
		}
	}
</style>

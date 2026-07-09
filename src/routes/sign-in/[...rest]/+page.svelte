<script>
	import { SignIn } from 'svelte-clerk';

	const features = [
		'Dashboard Ejecutivo',
		'Gestión de Clientes',
		'Cotizaciones',
		'Pagos',
		'Cobranza'
	];
</script>

<div class="auth-page">
	<section class="auth-brand" aria-label="Presentación de GestorPyme">
		<div class="brand-content">
			<div class="logo" aria-hidden="true">
				<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect width="40" height="40" rx="10" fill="#2563EB" />
					<path
						d="M10 28V12h5.25l4.25 9L23.75 12H29v16h-4v-9.25L19.75 28h-3.25L14 18.75V28H10Z"
						fill="white"
					/>
				</svg>
			</div>

			<h1 class="brand-title">GestorPyme</h1>
			<p class="brand-subtitle">
				Sistema integral para la administración de clientes, cotizaciones, pagos y cobranza.
			</p>

			<ul class="feature-list">
				{#each features as feature (feature)}
					<li>
						<span class="check" aria-hidden="true">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
									clip-rule="evenodd"
								/>
							</svg>
						</span>
						{feature}
					</li>
				{/each}
			</ul>
		</div>

		<div class="mockup" aria-hidden="true">
			<svg viewBox="0 0 480 320" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect x="8" y="8" width="464" height="304" rx="16" fill="#ffffff" stroke="#E2E8F0" />
				<rect x="8" y="8" width="464" height="48" rx="16" fill="#EFF6FF" />
				<rect x="8" y="40" width="464" height="16" fill="#EFF6FF" />
				<rect x="24" y="24" width="80" height="16" rx="4" fill="#2563EB" opacity="0.7" />
				<rect x="120" y="26" width="48" height="12" rx="3" fill="#CBD5E1" />
				<rect x="176" y="26" width="48" height="12" rx="3" fill="#CBD5E1" />
				<rect x="24" y="72" width="100" height="72" rx="10" fill="#EFF6FF" stroke="#BFDBFE" />
				<rect x="32" y="84" width="48" height="8" rx="2" fill="#64748B" opacity="0.5" />
				<rect x="32" y="100" width="64" height="16" rx="3" fill="#2563EB" opacity="0.6" />
				<rect x="136" y="72" width="100" height="72" rx="10" fill="#F0FDF4" stroke="#BBF7D0" />
				<rect x="144" y="84" width="48" height="8" rx="2" fill="#64748B" opacity="0.5" />
				<rect x="144" y="100" width="64" height="16" rx="3" fill="#16A34A" opacity="0.6" />
				<rect x="248" y="72" width="100" height="72" rx="10" fill="#FFF7ED" stroke="#FED7AA" />
				<rect x="256" y="84" width="48" height="8" rx="2" fill="#64748B" opacity="0.5" />
				<rect x="256" y="100" width="64" height="16" rx="3" fill="#F59E0B" opacity="0.6" />
				<rect x="360" y="72" width="96" height="72" rx="10" fill="#F5F3FF" stroke="#DDD6FE" />
				<rect x="368" y="84" width="48" height="8" rx="2" fill="#64748B" opacity="0.5" />
				<rect x="368" y="100" width="56" height="16" rx="3" fill="#7C3AED" opacity="0.6" />
				<rect x="24" y="160" width="432" height="128" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
				<rect x="36" y="176" width="64" height="8" rx="2" fill="#64748B" opacity="0.4" />
				<rect x="36" y="200" width="400" height="6" rx="2" fill="#2563EB" opacity="0.25" />
				<rect x="36" y="216" width="320" height="6" rx="2" fill="#2563EB" opacity="0.2" />
				<rect x="36" y="232" width="360" height="6" rx="2" fill="#2563EB" opacity="0.15" />
				<rect x="36" y="248" width="280" height="6" rx="2" fill="#2563EB" opacity="0.1" />
				<rect x="36" y="264" width="340" height="6" rx="2" fill="#2563EB" opacity="0.08" />
			</svg>
		</div>
	</section>

	<section class="auth-form-section" aria-label="Iniciar sesión">
		<div class="auth-card">
			<header class="card-header">
				<h2>Iniciar sesión</h2>
				<p>Accede con tu cuenta para continuar.</p>
			</header>

			<div class="clerk-wrapper">
				<SignIn routing="path" path="/sign-in" signUpUrl="/sign-in" />
			</div>
		</div>

		<footer class="auth-footer">
			<p>© 2026 GestorPyme</p>
			<p>Proyecto académico – Universidad Autónoma de Chihuahua</p>
		</footer>
	</section>
</div>

<style>
	.auth-page {
		display: grid;
		grid-template-columns: 1fr 1fr;
		min-height: 100dvh;
		background: var(--color-background, #f8fafc);
	}

	/* ——— Columna izquierda ——— */

	.auth-brand {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 3rem 3.5rem;
		overflow: hidden;
		background: linear-gradient(160deg, #eff6ff 0%, #f8fafc 45%, #f1f5f9 100%);
		border-right: 1px solid var(--color-border, #e2e8f0);
		animation: fade-in 0.5s ease;
	}

	.brand-content {
		position: relative;
		z-index: 1;
		max-width: 28rem;
	}

	.logo {
		width: 3rem;
		height: 3rem;
		margin-bottom: 1.5rem;
	}

	.logo svg {
		width: 100%;
		height: 100%;
	}

	.brand-title {
		margin: 0 0 0.75rem;
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--color-text, #0f172a);
		letter-spacing: -0.03em;
		line-height: 1.1;
	}

	.brand-subtitle {
		margin: 0 0 2rem;
		font-size: 1.0625rem;
		line-height: 1.65;
		color: var(--color-text-muted, #64748b);
	}

	.feature-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
	}

	.feature-list li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--color-text, #0f172a);
	}

	.check {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		background: var(--color-success-soft, #dcfce7);
		color: var(--color-success, #16a34a);
		flex-shrink: 0;
	}

	.check svg {
		width: 0.875rem;
		height: 0.875rem;
	}

	.mockup {
		position: absolute;
		right: -2rem;
		bottom: -1rem;
		width: min(90%, 28rem);
		opacity: 0.35;
		pointer-events: none;
		animation: float-in 0.8s ease 0.15s both;
	}

	.mockup svg {
		width: 100%;
		height: auto;
	}

	/* ——— Columna derecha ——— */

	.auth-form-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem 1.5rem;
		gap: 2rem;
		animation: fade-in 0.5s ease 0.1s both;
	}

	.auth-card {
		width: 100%;
		max-width: 26rem;
		padding: 2.25rem 2rem;
		background: var(--color-surface, #ffffff);
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: var(--radius-card, 1.125rem);
		box-shadow: var(--shadow-lg, 0 12px 32px rgba(15, 23, 42, 0.1));
		transition: box-shadow var(--transition, 0.2s ease);
	}

	.auth-card:hover {
		box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
	}

	.card-header {
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.card-header h2 {
		margin: 0 0 0.375rem;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text, #0f172a);
		letter-spacing: -0.02em;
	}

	.card-header p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-muted, #64748b);
	}

	.clerk-wrapper {
		display: flex;
		justify-content: center;
	}

	.clerk-wrapper :global(.cl-rootBox) {
		width: 100%;
	}

	.auth-footer {
		text-align: center;
		max-width: 26rem;
	}

	.auth-footer p {
		margin: 0;
		font-size: 0.75rem;
		color: var(--color-text-muted, #64748b);
		line-height: 1.6;
	}

	.auth-footer p + p {
		margin-top: 0.25rem;
		opacity: 0.85;
	}

	/* ——— Animaciones ——— */

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(0.5rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes float-in {
		from {
			opacity: 0;
			transform: translateY(1.5rem);
		}
		to {
			opacity: 0.35;
			transform: translateY(0);
		}
	}

	/* ——— Tablet ——— */

	@media (max-width: 1024px) {
		.auth-brand {
			padding: 2.5rem 2rem;
		}

		.brand-title {
			font-size: 2rem;
		}

		.mockup {
			width: min(85%, 22rem);
			opacity: 0.25;
		}
	}

	/* ——— Móvil ——— */

	@media (max-width: 768px) {
		.auth-page {
			grid-template-columns: 1fr;
		}

		.auth-brand {
			padding: 2rem 1.5rem 1.5rem;
			border-right: none;
			border-bottom: 1px solid var(--color-border, #e2e8f0);
		}

		.brand-content {
			max-width: none;
		}

		.brand-title {
			font-size: 1.75rem;
		}

		.brand-subtitle {
			font-size: 0.9375rem;
			margin-bottom: 1.25rem;
		}

		.feature-list {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 0.625rem;
		}

		.feature-list li {
			font-size: 0.8125rem;
		}

		.mockup {
			display: none;
		}

		.auth-form-section {
			padding: 1.5rem 1rem 2rem;
		}

		.auth-card {
			padding: 1.75rem 1.25rem;
		}
	}

	@media (max-width: 380px) {
		.feature-list {
			grid-template-columns: 1fr;
		}
	}
</style>

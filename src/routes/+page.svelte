<script>
	import { Show } from 'svelte-clerk';
</script>

<main class="home">
	<h1>GestorPyme</h1>
	<p>Sistema de cotizaciones para pymes.</p>

	<Show when="signed-out">
		<a class="link" href="/sign-in">Iniciar sesión</a>
	</Show>

	<Show when="signed-in">
		<a class="link" href="/dashboard">Ir al dashboard</a>
	</Show>
</main>

<style>
	.home {
		max-width: 32rem;
		margin: 4rem auto;
		padding: 0 1rem;
		font-family: system-ui, sans-serif;
	}

	.link {
		display: inline-block;
		margin-top: 1rem;
		color: #2563eb;
	}
</style>

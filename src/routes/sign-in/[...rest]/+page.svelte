<script>
	import { SignIn } from 'svelte-clerk';
</script>

<main class="auth">
	<h1>Iniciar sesión</h1>
	<p>Accede con tu cuenta de Google para continuar.</p>
	<SignIn routing="path" path="/sign-in" signUpUrl="/sign-in" />
</main>

<style>
	.auth {
		max-width: 28rem;
		margin: 3rem auto;
		padding: 0 1rem;
		font-family: system-ui, sans-serif;
	}
</style>

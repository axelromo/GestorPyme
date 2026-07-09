<script>
	/** @type {{ size?: 'sm' | 'md' }} */
	let { size = 'md' } = $props();
</script>

<span class="spinner spinner-{size}" aria-hidden="true"></span>

<style>
	.spinner {
		display: inline-block;
		border: 2px solid rgba(255, 255, 255, 0.35);
		border-top-color: currentColor;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	.spinner-sm {
		width: 0.875rem;
		height: 0.875rem;
	}

	.spinner-md {
		width: 1rem;
		height: 1rem;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>

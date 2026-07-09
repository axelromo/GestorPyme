<script>
	/**
	 * @type {{
	 *   id?: string,
	 *   name?: string,
	 *   type?: string,
	 *   label?: string,
	 *   value?: string,
	 *   placeholder?: string,
	 *   required?: boolean,
	 *   error?: string
	 * }}
	 */
	let {
		id = '',
		name = '',
		type = 'text',
		label = '',
		value = '',
		placeholder = '',
		required = false,
		error = ''
	} = $props();
</script>

<div class="field">
	{#if label}
		<label for={id}>{label}</label>
	{/if}
	<input {id} {name} {type} {value} {placeholder} {required} />
	{#if error}
		<p class="error">{error}</p>
	{/if}
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text, #0f172a);
	}

	input {
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.375rem;
		font: inherit;
		color: var(--color-text, #0f172a);
		background: #ffffff;
	}

	input:focus {
		outline: 2px solid var(--color-primary-soft, #eff6ff);
		border-color: var(--color-primary, #2563eb);
	}

	.error {
		margin: 0;
		font-size: 0.8125rem;
		color: #dc2626;
	}
</style>

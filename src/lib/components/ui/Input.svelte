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

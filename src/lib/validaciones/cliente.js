/**
 * @param {FormData} formData
 * @returns {{ errors: Record<string, string>, values: Record<string, string | boolean> }}
 */
export function validarClienteFormulario(formData) {
	const nombre = String(formData.get('nombre') ?? '').trim();
	const empresa = String(formData.get('empresa') ?? '').trim();
	const email = String(formData.get('email') ?? '').trim();
	const telefono = String(formData.get('telefono') ?? '').trim();
	const direccion = String(formData.get('direccion') ?? '').trim();
	const rfc = String(formData.get('rfc') ?? '')
		.trim()
		.toUpperCase();
	const notas = String(formData.get('notas') ?? '').trim();
	const activo = formData.get('activo') === 'on';

	/** @type {Record<string, string>} */
	const errors = {};

	if (!nombre) {
		errors.nombre = 'El nombre es obligatorio.';
	}

	if (!email) {
		errors.email = 'El correo electrónico es obligatorio.';
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		errors.email = 'Ingresa un correo electrónico válido.';
	}

	if (rfc && !/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(rfc)) {
		errors.rfc = 'Ingresa un RFC válido.';
	}

	return {
		errors,
		values: {
			nombre,
			empresa,
			email,
			telefono,
			direccion,
			rfc,
			notas,
			activo
		}
	};
}

/**
 * @param {{
 *   nombre: string,
 *   empresa: string | null,
 *   email: string,
 *   telefono: string | null,
 *   direccion: string | null,
 *   rfc: string | null,
 *   notas: string | null,
 *   activo: boolean
 * }} cliente
 * @returns {Record<string, string | boolean>}
 */
export function mapClienteToFormValues(cliente) {
	return {
		nombre: cliente.nombre,
		empresa: cliente.empresa ?? '',
		email: cliente.email,
		telefono: cliente.telefono ?? '',
		direccion: cliente.direccion ?? '',
		rfc: cliente.rfc ?? '',
		notas: cliente.notas ?? '',
		activo: cliente.activo
	};
}

/**
 * @param {Record<string, string | boolean>} values
 */
export function mapValuesToClienteData(values) {
	return {
		nombre: String(values.nombre),
		empresa: values.empresa ? String(values.empresa) : null,
		email: String(values.email),
		telefono: values.telefono ? String(values.telefono) : null,
		direccion: values.direccion ? String(values.direccion) : null,
		rfc: values.rfc ? String(values.rfc) : null,
		notas: values.notas ? String(values.notas) : null,
		activo: Boolean(values.activo)
	};
}

/**
 * @param {string} url
 */
function esSitioWebValido(url) {
	if (!url.trim()) {
		return true;
	}

	try {
		const normalizada = /^https?:\/\//i.test(url) ? url : `https://${url}`;
		const parsed = new URL(normalizada);
		return Boolean(parsed.hostname);
	} catch {
		return false;
	}
}

/**
 * @param {FormData} formData
 */
export function validarEmpresaFormulario(formData) {
	const nombreEmpresa = String(formData.get('nombreEmpresa') ?? '').trim();
	const razonSocial = String(formData.get('razonSocial') ?? '').trim();
	const rfc = String(formData.get('rfc') ?? '')
		.trim()
		.toUpperCase();
	const correo = String(formData.get('correo') ?? '').trim();
	const telefono = String(formData.get('telefono') ?? '').trim();
	const direccion = String(formData.get('direccion') ?? '').trim();
	const ciudad = String(formData.get('ciudad') ?? '').trim();
	const estado = String(formData.get('estado') ?? '').trim();
	const codigoPostal = String(formData.get('codigoPostal') ?? '').trim();
	const sitioWeb = String(formData.get('sitioWeb') ?? '').trim();
	const logo = String(formData.get('logo') ?? '').trim();

	/** @type {Record<string, string>} */
	const errors = {};

	if (!nombreEmpresa) {
		errors.nombreEmpresa = 'El nombre de la empresa es obligatorio.';
	}

	if (rfc && !/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(rfc)) {
		errors.rfc = 'Ingresa un RFC válido.';
	}

	if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
		errors.correo = 'Ingresa un correo electrónico válido.';
	}

	if (sitioWeb && !esSitioWebValido(sitioWeb)) {
		errors.sitioWeb = 'Ingresa un sitio web válido.';
	}

	if (logo) {
		try {
			const normalizada = /^https?:\/\//i.test(logo) ? logo : `https://${logo}`;
			new URL(normalizada);
		} catch {
			errors.logo = 'Ingresa una URL de logo válida.';
		}
	}

	return {
		errors,
		values: {
			nombreEmpresa,
			razonSocial,
			rfc,
			correo,
			telefono,
			direccion,
			ciudad,
			estado,
			codigoPostal,
			sitioWeb,
			logo
		}
	};
}

/**
 * @param {import('@prisma/client').ConfiguracionEmpresa} empresa
 */
export function mapEmpresaToFormValues(empresa) {
	return {
		nombreEmpresa: empresa.nombreEmpresa ?? '',
		razonSocial: empresa.razonSocial ?? '',
		rfc: empresa.rfc ?? '',
		correo: empresa.correo ?? '',
		telefono: empresa.telefono ?? '',
		direccion: empresa.direccion ?? '',
		ciudad: empresa.ciudad ?? '',
		estado: empresa.estado ?? '',
		codigoPostal: empresa.codigoPostal ?? '',
		sitioWeb: empresa.sitioWeb ?? '',
		logo: empresa.logo ?? ''
	};
}

/**
 * @param {Record<string, string>} values
 */
export function mapValuesToEmpresaData(values) {
	return {
		nombreEmpresa: values.nombreEmpresa,
		razonSocial: values.razonSocial || '',
		rfc: values.rfc ? values.rfc : null,
		correo: values.correo ? values.correo : null,
		telefono: values.telefono ? values.telefono : null,
		direccion: values.direccion ? values.direccion : null,
		ciudad: values.ciudad ? values.ciudad : null,
		estado: values.estado ? values.estado : null,
		codigoPostal: values.codigoPostal ? values.codigoPostal : null,
		sitioWeb: values.sitioWeb ? values.sitioWeb : null,
		logo: values.logo ? values.logo : null
	};
}

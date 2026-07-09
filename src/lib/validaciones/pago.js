/** @type {import('@prisma/client').MetodoPago[]} */
export const METODOS_PAGO = ['TRANSFERENCIA', 'EFECTIVO', 'TARJETA', 'CHEQUE', 'OTRO'];

/** @type {Record<string, string>} */
export const ETIQUETAS_METODO = {
	TRANSFERENCIA: 'Transferencia',
	EFECTIVO: 'Efectivo',
	TARJETA: 'Tarjeta',
	CHEQUE: 'Cheque',
	OTRO: 'Otro'
};

/**
 * @param {number} totalPagado
 * @param {number} totalCotizacion
 */
export function derivarEstadoPago(totalPagado, totalCotizacion) {
	if (totalPagado <= 0) {
		return 'PENDIENTE';
	}

	if (totalPagado >= totalCotizacion) {
		return 'PAGADO';
	}

	return 'PARCIAL';
}

/**
 * @param {FormData} formData
 */
export function validarPagoFormulario(formData) {
	/** @type {Record<string, string>} */
	const errors = {};

	const cotizacionId = String(formData.get('cotizacionId') ?? '').trim();
	const fecha = String(formData.get('fecha') ?? '').trim();
	const monto = String(formData.get('monto') ?? '').trim();
	const metodo = String(formData.get('metodo') ?? '').trim();
	const referencia = String(formData.get('referencia') ?? '').trim();

	const values = {
		cotizacionId,
		fecha,
		monto,
		metodo,
		referencia
	};

	if (!cotizacionId) {
		errors.cotizacionId = 'La cotización es obligatoria.';
	}

	if (!fecha) {
		errors.fecha = 'La fecha es obligatoria.';
	} else if (Number.isNaN(Date.parse(fecha))) {
		errors.fecha = 'La fecha no es válida.';
	}

	if (!monto) {
		errors.monto = 'El monto es obligatorio.';
	} else {
		const montoNumerico = Number(monto);
		if (Number.isNaN(montoNumerico) || montoNumerico <= 0) {
			errors.monto = 'El monto debe ser mayor a cero.';
		}
	}

	if (!metodo) {
		errors.metodo = 'El método de pago es obligatorio.';
	} else if (!METODOS_PAGO.includes(/** @type {import('@prisma/client').MetodoPago} */ (metodo))) {
		errors.metodo = 'El método de pago no es válido.';
	}

	return { errors, values };
}

/**
 * @param {Record<string, string>} values
 */
export function mapValuesToPagoData(values) {
	return {
		cotizacionId: values.cotizacionId,
		fecha: new Date(values.fecha),
		monto: values.monto,
		metodo: /** @type {import('@prisma/client').MetodoPago} */ (values.metodo),
		referencia: values.referencia ? values.referencia : null
	};
}

/**
 * @param {import('@prisma/client').Pago} pago
 */
export function mapPagoToFormValues(pago) {
	const fecha = pago.fecha.toISOString().slice(0, 10);

	return {
		cotizacionId: pago.cotizacionId,
		fecha,
		monto: String(pago.monto),
		metodo: pago.metodo,
		referencia: pago.referencia ?? ''
	};
}

/**
 * @param {import('@prisma/client').Pago & {
 *   cotizacion: {
 *     folio: string,
 *     total: import('@prisma/client').Decimal,
 *     pagos: Array<{ monto: import('@prisma/client').Decimal }>,
 *     cliente: { nombre: string, empresa: string | null }
 *   }
 * }} pago
 */
export function serializarPagoListado(pago) {
	const totalPagado = pago.cotizacion.pagos.reduce(
		(acumulado, item) => acumulado + Number(item.monto),
		0
	);
	const totalCotizacion = Number(pago.cotizacion.total);

	return {
		id: pago.id,
		fecha: pago.fecha.toISOString(),
		folio: pago.cotizacion.folio,
		clienteNombre: pago.cotizacion.cliente.empresa
			? `${pago.cotizacion.cliente.nombre} (${pago.cotizacion.cliente.empresa})`
			: pago.cotizacion.cliente.nombre,
		metodo: pago.metodo,
		monto: Number(pago.monto),
		referencia: pago.referencia,
		estadoPago: derivarEstadoPago(totalPagado, totalCotizacion),
		cotizacionId: pago.cotizacionId
	};
}

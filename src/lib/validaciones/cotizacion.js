import { calcularImporteConcepto, calcularTotales } from '$lib/cotizaciones/calculos.js';
import { ESTADOS_COTIZACION } from '$lib/cotizaciones/estado.js';

/**
 * @param {FormData} formData
 * @returns {Array<{ descripcion: string, cantidad: string, precioUnitario: string, descuento: string }>}
 */
export function parsearConceptosDesdeFormData(formData) {
	/** @type {Array<{ descripcion: string, cantidad: string, precioUnitario: string, descuento: string }>} */
	const conceptos = [];
	let indice = 0;

	while (formData.has(`conceptos[${indice}][descripcion]`)) {
		conceptos.push({
			descripcion: String(formData.get(`conceptos[${indice}][descripcion]`) ?? '').trim(),
			cantidad: String(formData.get(`conceptos[${indice}][cantidad]`) ?? '').trim(),
			precioUnitario: String(formData.get(`conceptos[${indice}][precioUnitario]`) ?? '').trim(),
			descuento: String(formData.get(`conceptos[${indice}][descuento]`) ?? '0').trim()
		});
		indice += 1;
	}

	return conceptos;
}

/**
 * @param {FormData} formData
 * @param {{ validarEstado?: boolean }} [opciones]
 */
export function validarCotizacionFormulario(formData, opciones = {}) {
	const clienteId = String(formData.get('clienteId') ?? '').trim();
	const fecha = String(formData.get('fecha') ?? '').trim();
	const fechaVencimiento = String(formData.get('fechaVencimiento') ?? '').trim();
	const observaciones = String(formData.get('observaciones') ?? '').trim();
	const estado = String(formData.get('estado') ?? 'BORRADOR').trim();
	const tasaIVA = String(formData.get('tasaIVA') ?? '0.16').trim();
	const conceptosRaw = parsearConceptosDesdeFormData(formData);

	/** @type {Record<string, string>} */
	const errors = {};
	/** @type {Record<string, string>} */
	const conceptoErrors = {};

	if (!clienteId) {
		errors.clienteId = 'El cliente es obligatorio.';
	}

	if (!fecha) {
		errors.fecha = 'La fecha es obligatoria.';
	} else if (Number.isNaN(Date.parse(fecha))) {
		errors.fecha = 'Ingresa una fecha válida.';
	}

	if (fechaVencimiento && Number.isNaN(Date.parse(fechaVencimiento))) {
		errors.fechaVencimiento = 'Ingresa una fecha de vencimiento válida.';
	}

	if (opciones.validarEstado && !ESTADOS_COTIZACION.includes(estado)) {
		errors.estado = 'El estado no es válido.';
	}

	const tasaIVANumero = Number(tasaIVA);
	if (Number.isNaN(tasaIVANumero) || tasaIVANumero < 0) {
		errors.tasaIVA = 'La tasa de IVA no es válida.';
	}

	if (conceptosRaw.length === 0) {
		errors.conceptos = 'Debe existir al menos un concepto.';
	}

	/** @type {Array<{ descripcion: string, cantidad: number, precioUnitario: number, descuento: number, importe: number }>} */
	const conceptos = [];

	conceptosRaw.forEach((concepto, indice) => {
		const cantidad = Number(concepto.cantidad);
		const precioUnitario = Number(concepto.precioUnitario);
		const descuento = Number(concepto.descuento || 0);
		const prefijo = `conceptos[${indice}]`;

		if (!concepto.descripcion) {
			conceptoErrors[`${prefijo}.descripcion`] = 'La descripción es obligatoria.';
		}

		if (Number.isNaN(cantidad) || cantidad <= 0) {
			conceptoErrors[`${prefijo}.cantidad`] = 'La cantidad debe ser mayor a 0.';
		}

		if (Number.isNaN(precioUnitario) || precioUnitario < 0) {
			conceptoErrors[`${prefijo}.precioUnitario`] = 'El precio debe ser mayor o igual a 0.';
		}

		if (Number.isNaN(descuento) || descuento < 0) {
			conceptoErrors[`${prefijo}.descuento`] = 'El descuento no es válido.';
		}

		if (
			concepto.descripcion &&
			!Number.isNaN(cantidad) &&
			cantidad > 0 &&
			!Number.isNaN(precioUnitario) &&
			precioUnitario >= 0
		) {
			conceptos.push({
				descripcion: concepto.descripcion,
				cantidad,
				precioUnitario,
				descuento: Number.isNaN(descuento) ? 0 : descuento,
				importe: calcularImporteConcepto(cantidad, precioUnitario, descuento)
			});
		}
	});

	const todosErrores = { ...errors, ...conceptoErrors };
	const totales =
		conceptos.length > 0 && !Number.isNaN(tasaIVANumero)
			? calcularTotales(conceptos, tasaIVANumero)
			: { subtotal: 0, iva: 0, total: 0 };

	return {
		errors: todosErrores,
		values: {
			clienteId,
			fecha,
			fechaVencimiento,
			observaciones,
			estado,
			tasaIVA,
			conceptos: conceptosRaw
		},
		conceptos,
		totales,
		tasaIVANumero: Number.isNaN(tasaIVANumero) ? 0.16 : tasaIVANumero
	};
}

/**
 * @param {import('@prisma/client').Cotizacion & { conceptos: import('@prisma/client').Concepto[], cliente?: { id: string, nombre: string } }} cotizacion
 */
export function mapCotizacionToFormValues(cotizacion) {
	return {
		clienteId: cotizacion.clienteId,
		fecha: cotizacion.fecha.toISOString().slice(0, 10),
		fechaVencimiento: cotizacion.fechaVencimiento
			? cotizacion.fechaVencimiento.toISOString().slice(0, 10)
			: '',
		observaciones: cotizacion.observaciones ?? '',
		estado: cotizacion.estado,
		tasaIVA: String(cotizacion.tasaIVA),
		conceptos: cotizacion.conceptos
			.sort((a, b) => a.orden - b.orden)
			.map((concepto) => ({
				descripcion: concepto.descripcion,
				cantidad: String(concepto.cantidad),
				precioUnitario: String(concepto.precioUnitario),
				descuento: String(concepto.descuento)
			}))
	};
}

/**
 * @param {import('@prisma/client').Cotizacion & { conceptos: import('@prisma/client').Concepto[], cliente: { id: string, nombre: string, empresa: string | null, email: string }, historial?: import('@prisma/client').Historial[] }} cotizacion
 */
export function serializarCotizacionDetalle(cotizacion) {
	return {
		id: cotizacion.id,
		folio: cotizacion.folio,
		clienteId: cotizacion.clienteId,
		clienteNombre: cotizacion.cliente.empresa
			? `${cotizacion.cliente.nombre} (${cotizacion.cliente.empresa})`
			: cotizacion.cliente.nombre,
		clienteEmail: cotizacion.cliente.email,
		fecha: cotizacion.fecha.toISOString(),
		fechaVencimiento: cotizacion.fechaVencimiento?.toISOString() ?? null,
		estado: cotizacion.estado,
		observaciones: cotizacion.observaciones,
		moneda: cotizacion.moneda,
		tasaIVA: Number(cotizacion.tasaIVA),
		subtotal: Number(cotizacion.subtotal),
		iva: Number(cotizacion.iva),
		total: Number(cotizacion.total),
		conceptos: cotizacion.conceptos
			.sort((a, b) => a.orden - b.orden)
			.map((concepto) => ({
				id: concepto.id,
				descripcion: concepto.descripcion,
				cantidad: Number(concepto.cantidad),
				precioUnitario: Number(concepto.precioUnitario),
				descuento: Number(concepto.descuento),
				importe: Number(concepto.importe)
			})),
		historial: (cotizacion.historial ?? [])
			.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
			.map((evento) => ({
				id: evento.id,
				accion: evento.accion,
				descripcion: evento.descripcion,
				usuarioId: evento.usuarioId,
				fecha: evento.fecha.toISOString()
			}))
	};
}

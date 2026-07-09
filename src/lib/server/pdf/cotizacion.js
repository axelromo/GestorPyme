import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { formatearMoneda } from '$lib/cotizaciones/calculos.js';
import { formatearDireccionEmpresa } from '$lib/server/configuracion.js';
import { logger } from '$lib/server/logger.js';

/** @type {Record<string, string>} */
const ETIQUETAS_ESTADO = {
	BORRADOR: 'Borrador',
	ENVIADA: 'Enviada',
	APROBADA: 'Aprobada',
	RECHAZADA: 'Rechazada',
	FACTURADA: 'Facturada',
	PAGADA: 'Pagada'
};

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const FOOTER_Y = 40;

const COLOR_PRIMARY = rgb(0.145, 0.388, 0.922);
const COLOR_TEXT = rgb(0.059, 0.09, 0.165);
const COLOR_MUTED = rgb(0.392, 0.455, 0.545);
const COLOR_BORDER = rgb(0.886, 0.91, 0.941);
const COLOR_HEADER_BG = rgb(0.945, 0.961, 0.976);

/**
 * @param {import('pdf-lib').PDFFont} font
 * @param {string} text
 * @param {number} size
 * @param {number} maxWidth
 */
function dividirTexto(font, text, size, maxWidth) {
	const palabras = String(text).split(/\s+/).filter(Boolean);
	if (palabras.length === 0) {
		return [''];
	}

	/** @type {string[]} */
	const lineas = [];
	let lineaActual = palabras[0];

	for (let i = 1; i < palabras.length; i += 1) {
		const candidata = `${lineaActual} ${palabras[i]}`;
		if (font.widthOfTextAtSize(candidata, size) <= maxWidth) {
			lineaActual = candidata;
		} else {
			lineas.push(lineaActual);
			lineaActual = palabras[i];
		}
	}

	lineas.push(lineaActual);
	return lineas;
}

/**
 * @param {Date | string | null | undefined} fecha
 */
function formatearFecha(fecha) {
	if (!fecha) {
		return '—';
	}

	return new Date(fecha).toLocaleDateString('es-MX', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

/**
 * @param {number | import('@prisma/client/runtime/library').Decimal} valor
 * @param {number} [decimales]
 */
function formatearCantidad(valor, decimales = 2) {
	const numero = Number(valor);
	if (Number.isInteger(numero)) {
		return String(numero);
	}

	return numero.toLocaleString('es-MX', {
		minimumFractionDigits: 0,
		maximumFractionDigits: decimales
	});
}

/**
 * @param {import('pdf-lib').PDFPage} page
 * @param {import('pdf-lib').PDFFont} font
 * @param {string} texto
 * @param {number} x
 * @param {number} y
 * @param {number} size
 * @param {import('pdf-lib').Color} color
 */
function dibujarTexto(page, font, texto, x, y, size, color = COLOR_TEXT) {
	page.drawText(texto, { x, y, size, font, color });
}

/**
 * @param {import('pdf-lib').PDFPage} page
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 */
function dibujarRectangulo(page, x, y, width, height, fillColor, borderColor) {
	page.drawRectangle({
		x,
		y,
		width,
		height,
		color: fillColor,
		borderColor,
		borderWidth: borderColor ? 1 : 0
	});
}

/**
 * @param {import('pdf-lib').PDFDocument} pdfDoc
 * @param {import('pdf-lib').PDFFont} fontRegular
 * @param {import('pdf-lib').PDFFont} fontBold
 */
function crearPagina(pdfDoc, fontRegular, fontBold) {
	const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

	return {
		page,
		fontRegular,
		fontBold,
		y: PAGE_HEIGHT - MARGIN
	};
}

/**
 * @param {{
 *   page: import('pdf-lib').PDFPage,
 *   fontRegular: import('pdf-lib').PDFFont,
 *   fontBold: import('pdf-lib').PDFFont,
 *   y: number
 * }} ctx
 * @param {import('pdf-lib').PDFDocument} pdfDoc
 */
function asegurarEspacio(ctx, pdfDoc, alturaNecesaria) {
	if (ctx.y - alturaNecesaria >= FOOTER_Y + 20) {
		return ctx;
	}

	const nuevaPagina = crearPagina(pdfDoc, ctx.fontRegular, ctx.fontBold);
	return { ...nuevaPagina, y: nuevaPagina.y - 10 };
}

/**
 * @param {{
 *   page: import('pdf-lib').PDFPage,
 *   fontRegular: import('pdf-lib').PDFFont,
 *   fontBold: import('pdf-lib').PDFFont,
 *   y: number
 * }} ctx
 * @param {string} titulo
 */
function dibujarSeccion(ctx, titulo) {
	dibujarTexto(ctx.page, ctx.fontBold, titulo, MARGIN, ctx.y, 11, COLOR_PRIMARY);
	ctx.y -= 18;
	return ctx;
}

/**
 * @param {{
 *   page: import('pdf-lib').PDFPage,
 *   fontRegular: import('pdf-lib').PDFFont,
 *   fontBold: import('pdf-lib').PDFFont,
 *   y: number
 * }} ctx
 * @param {string} etiqueta
 * @param {string} valor
 */
function dibujarCampo(ctx, etiqueta, valor) {
	dibujarTexto(ctx.page, ctx.fontBold, `${etiqueta}:`, MARGIN, ctx.y, 9, COLOR_MUTED);
	dibujarTexto(ctx.page, ctx.fontRegular, valor, MARGIN + 110, ctx.y, 9, COLOR_TEXT);
	ctx.y -= 14;
	return ctx;
}

/**
 * @param {import('pdf-lib').PDFDocument} pdfDoc
 * @param {string | null | undefined} logoUrl
 */
async function cargarLogo(pdfDoc, logoUrl) {
	if (!logoUrl?.trim()) {
		return null;
	}

	try {
		const url = logoUrl.trim();
		const respuesta = await fetch(url);
		if (!respuesta.ok) {
			logger.warn('pdf:cargarLogo', 'No se pudo descargar el logo', {
				url,
				status: respuesta.status
			});
			return null;
		}

		const bytes = await respuesta.arrayBuffer();
		const tipo = respuesta.headers.get('content-type') ?? '';

		if (tipo.includes('png')) {
			return pdfDoc.embedPng(bytes);
		}

		if (tipo.includes('jpeg') || tipo.includes('jpg')) {
			return pdfDoc.embedJpg(bytes);
		}

		if (url.toLowerCase().endsWith('.png')) {
			return pdfDoc.embedPng(bytes);
		}

		if (/\.(jpe?g)$/i.test(url)) {
			return pdfDoc.embedJpg(bytes);
		}

		return null;
	} catch (err) {
		logger.pdf('cargarLogo', err, { url: logoUrl?.trim() });
		return null;
	}
}

/**
 * @param {{
 *   page: import('pdf-lib').PDFPage,
 *   fontRegular: import('pdf-lib').PDFFont,
 *   fontBold: import('pdf-lib').PDFFont,
 *   y: number
 * }} ctx
 * @param {import('@prisma/client').Cotizacion} cotizacion
 * @param {import('@prisma/client').ConfiguracionEmpresa} empresa
 * @param {import('pdf-lib').PDFImage | null} logo
 */
function dibujarEncabezado(ctx, cotizacion, empresa, logo) {
	const logoSize = 56;
	let infoX = MARGIN;
	let infoY = ctx.y;

	if (logo) {
		const logoY = ctx.y - logoSize;
		ctx.page.drawImage(logo, {
			x: MARGIN,
			y: logoY,
			width: logoSize,
			height: logoSize
		});
		infoX = MARGIN + logoSize + 16;
	}

	const nombreEmpresa = empresa.nombreEmpresa?.trim() || 'Mi Empresa';
	const direccion = formatearDireccionEmpresa(empresa);
	const telefono = empresa.telefono?.trim();
	const correo = empresa.correo?.trim();
	const rfc = empresa.rfc?.trim();

	dibujarTexto(ctx.page, ctx.fontBold, nombreEmpresa, infoX, infoY, 14, COLOR_PRIMARY);
	infoY -= 16;

	if (direccion) {
		dibujarTexto(ctx.page, ctx.fontRegular, direccion, infoX, infoY, 9, COLOR_TEXT);
		infoY -= 12;
	}

	const contacto = [telefono ? `Tel: ${telefono}` : null, correo].filter(Boolean).join('  |  ');
	if (contacto) {
		dibujarTexto(ctx.page, ctx.fontRegular, contacto, infoX, infoY, 9, COLOR_TEXT);
		infoY -= 12;
	}

	if (rfc) {
		dibujarTexto(ctx.page, ctx.fontRegular, `RFC: ${rfc}`, infoX, infoY, 9, COLOR_TEXT);
		infoY -= 12;
	}

	const bloqueDerechoX = PAGE_WIDTH - MARGIN - 170;
	let derechaY = ctx.y;

	dibujarTexto(ctx.page, ctx.fontBold, 'COTIZACIÓN', bloqueDerechoX, derechaY, 18, COLOR_PRIMARY);
	derechaY -= 22;
	dibujarTexto(
		ctx.page,
		ctx.fontBold,
		`Folio: ${cotizacion.folio}`,
		bloqueDerechoX,
		derechaY,
		10,
		COLOR_TEXT
	);
	derechaY -= 14;
	dibujarTexto(
		ctx.page,
		ctx.fontRegular,
		`Fecha: ${formatearFecha(cotizacion.fecha)}`,
		bloqueDerechoX,
		derechaY,
		9,
		COLOR_TEXT
	);
	derechaY -= 12;
	dibujarTexto(
		ctx.page,
		ctx.fontRegular,
		`Vigencia: ${formatearFecha(cotizacion.fechaVencimiento)}`,
		bloqueDerechoX,
		derechaY,
		9,
		COLOR_TEXT
	);
	derechaY -= 12;
	dibujarTexto(
		ctx.page,
		ctx.fontRegular,
		`Estado: ${ETIQUETAS_ESTADO[cotizacion.estado] ?? cotizacion.estado}`,
		bloqueDerechoX,
		derechaY,
		9,
		COLOR_TEXT
	);

	const baseY = logo ? ctx.y - logoSize : infoY;
	ctx.y = Math.min(baseY, infoY) - 24;

	ctx.page.drawLine({
		start: { x: MARGIN, y: ctx.y },
		end: { x: PAGE_WIDTH - MARGIN, y: ctx.y },
		thickness: 1,
		color: COLOR_BORDER
	});

	ctx.y -= 20;
	return ctx;
}

/**
 * @param {{
 *   page: import('pdf-lib').PDFPage,
 *   fontRegular: import('pdf-lib').PDFFont,
 *   fontBold: import('pdf-lib').PDFFont,
 *   y: number
 * }} ctx
 * @param {import('@prisma/client').Cliente} cliente
 */
function dibujarCliente(ctx, cliente) {
	ctx = dibujarSeccion(ctx, 'Cliente');
	ctx = dibujarCampo(ctx, 'Nombre', cliente.nombre);
	ctx = dibujarCampo(ctx, 'Empresa', cliente.empresa?.trim() || '—');
	ctx = dibujarCampo(ctx, 'Correo', cliente.email);
	ctx = dibujarCampo(ctx, 'Teléfono', cliente.telefono?.trim() || '—');
	ctx = dibujarCampo(ctx, 'RFC', cliente.rfc?.trim() || '—');
	ctx = dibujarCampo(ctx, 'Dirección', cliente.direccion?.trim() || '—');
	ctx.y -= 8;
	return ctx;
}

/**
 * @param {{
 *   page: import('pdf-lib').PDFPage,
 *   fontRegular: import('pdf-lib').PDFFont,
 *   fontBold: import('pdf-lib').PDFFont,
 *   y: number
 * }} ctx
 * @param {import('pdf-lib').PDFDocument} pdfDoc
 */
function dibujarEncabezadoTabla(ctx, pdfDoc) {
	ctx = asegurarEspacio(ctx, pdfDoc, 30);
	ctx = dibujarSeccion(ctx, 'Conceptos');

	const columnas = [
		{ etiqueta: 'Descripción', ancho: CONTENT_WIDTH * 0.46, alineacion: 'left' },
		{ etiqueta: 'Cantidad', ancho: CONTENT_WIDTH * 0.14, alineacion: 'right' },
		{ etiqueta: 'Precio Unit.', ancho: CONTENT_WIDTH * 0.2, alineacion: 'right' },
		{ etiqueta: 'Importe', ancho: CONTENT_WIDTH * 0.2, alineacion: 'right' }
	];

	const alturaFila = 22;
	const tablaY = ctx.y - alturaFila;

	dibujarRectangulo(
		ctx.page,
		MARGIN,
		tablaY,
		CONTENT_WIDTH,
		alturaFila,
		COLOR_HEADER_BG,
		COLOR_BORDER
	);

	let columnaX = MARGIN + 8;
	for (const columna of columnas) {
		const textoX = columna.alineacion === 'right' ? columnaX + columna.ancho - 16 : columnaX;
		dibujarTexto(ctx.page, ctx.fontBold, columna.etiqueta, textoX, tablaY + 7, 9, COLOR_TEXT);
		columnaX += columna.ancho;
	}

	ctx.y = tablaY - 2;
	return { ctx, columnas, alturaFila };
}

/**
 * @param {{
 *   page: import('pdf-lib').PDFPage,
 *   fontRegular: import('pdf-lib').PDFFont,
 *   fontBold: import('pdf-lib').PDFFont,
 *   y: number
 * }} ctx
 * @param {import('pdf-lib').PDFDocument} pdfDoc
 * @param {Array<{ descripcion: string, cantidad: import('@prisma/client/runtime/library').Decimal | number, precioUnitario: import('@prisma/client/runtime/library').Decimal | number, importe: import('@prisma/client/runtime/library').Decimal | number }>} conceptos
 * @param {Array<{ etiqueta: string, ancho: number, alineacion: string }>} columnas
 * @param {number} alturaFila
 */
function dibujarConceptos(ctx, pdfDoc, conceptos, columnas, alturaFila) {
	for (const concepto of conceptos) {
		const lineasDescripcion = dividirTexto(
			ctx.fontRegular,
			concepto.descripcion,
			9,
			columnas[0].ancho - 16
		);
		const alturaConcepto = Math.max(alturaFila, lineasDescripcion.length * 12 + 10);

		ctx = asegurarEspacio(ctx, pdfDoc, alturaConcepto + 4);
		const filaY = ctx.y - alturaConcepto;

		dibujarRectangulo(
			ctx.page,
			MARGIN,
			filaY,
			CONTENT_WIDTH,
			alturaConcepto,
			rgb(1, 1, 1),
			COLOR_BORDER
		);

		let columnaX = MARGIN + 8;
		let descripcionY = filaY + alturaConcepto - 14;
		for (const linea of lineasDescripcion) {
			dibujarTexto(ctx.page, ctx.fontRegular, linea, columnaX, descripcionY, 9, COLOR_TEXT);
			descripcionY -= 12;
		}

		columnaX += columnas[0].ancho;
		const valores = [
			formatearCantidad(concepto.cantidad),
			formatearMoneda(Number(concepto.precioUnitario)),
			formatearMoneda(Number(concepto.importe))
		];

		for (let i = 0; i < valores.length; i += 1) {
			const columna = columnas[i + 1];
			const anchoTexto = ctx.fontRegular.widthOfTextAtSize(valores[i], 9);
			const textoX = columnaX + columna.ancho - anchoTexto - 8;
			dibujarTexto(
				ctx.page,
				ctx.fontRegular,
				valores[i],
				textoX,
				filaY + alturaConcepto - 14,
				9,
				COLOR_TEXT
			);
			columnaX += columna.ancho;
		}

		ctx.y = filaY - 2;
	}

	return ctx;
}

/**
 * @param {{
 *   page: import('pdf-lib').PDFPage,
 *   fontRegular: import('pdf-lib').PDFFont,
 *   fontBold: import('pdf-lib').PDFFont,
 *   y: number
 * }} ctx
 * @param {import('pdf-lib').PDFDocument} pdfDoc
 * @param {import('@prisma/client').Cotizacion} cotizacion
 */
function dibujarTotales(ctx, pdfDoc, cotizacion) {
	ctx = asegurarEspacio(ctx, pdfDoc, 80);
	ctx.y -= 12;

	const bloqueAncho = 220;
	const bloqueX = PAGE_WIDTH - MARGIN - bloqueAncho;
	const filas = [
		{ etiqueta: 'Subtotal', valor: formatearMoneda(Number(cotizacion.subtotal)) },
		{ etiqueta: 'IVA', valor: formatearMoneda(Number(cotizacion.iva)) },
		{ etiqueta: 'Total', valor: formatearMoneda(Number(cotizacion.total)), destacado: true }
	];

	for (const fila of filas) {
		const fuente = fila.destacado ? ctx.fontBold : ctx.fontRegular;
		const tamano = fila.destacado ? 11 : 10;
		dibujarTexto(ctx.page, fuente, fila.etiqueta, bloqueX, ctx.y, tamano, COLOR_TEXT);
		const anchoValor = fuente.widthOfTextAtSize(fila.valor, tamano);
		dibujarTexto(
			ctx.page,
			fuente,
			fila.valor,
			bloqueX + bloqueAncho - anchoValor,
			ctx.y,
			tamano,
			fila.destacado ? COLOR_PRIMARY : COLOR_TEXT
		);
		ctx.y -= fila.destacado ? 18 : 14;
	}

	ctx.y -= 10;
	return ctx;
}

/**
 * @param {{
 *   page: import('pdf-lib').PDFPage,
 *   fontRegular: import('pdf-lib').PDFFont,
 *   fontBold: import('pdf-lib').PDFFont,
 *   y: number
 * }} ctx
 * @param {import('pdf-lib').PDFDocument} pdfDoc
 * @param {string | null | undefined} observaciones
 */
function dibujarObservaciones(ctx, pdfDoc, observaciones) {
	ctx = asegurarEspacio(ctx, pdfDoc, 60);
	ctx = dibujarSeccion(ctx, 'Observaciones');

	const texto = observaciones?.trim() ? observaciones.trim() : '—';
	const lineas = dividirTexto(ctx.fontRegular, texto, 9, CONTENT_WIDTH);

	for (const linea of lineas) {
		ctx = asegurarEspacio(ctx, pdfDoc, 14);
		dibujarTexto(ctx.page, ctx.fontRegular, linea, MARGIN, ctx.y, 9, COLOR_TEXT);
		ctx.y -= 12;
	}

	ctx.y -= 8;
	return ctx;
}

/**
 * @param {import('pdf-lib').PDFPage} page
 * @param {import('pdf-lib').PDFFont} font
 */
function dibujarPie(page, font) {
	const mensaje = 'Gracias por su preferencia.';
	const ancho = font.widthOfTextAtSize(mensaje, 10);
	dibujarTexto(page, font, mensaje, (PAGE_WIDTH - ancho) / 2, FOOTER_Y, 10, COLOR_MUTED);
}

/**
 * @param {import('@prisma/client').Cotizacion} cotizacion
 * @param {import('@prisma/client').Cliente} cliente
 * @param {import('@prisma/client').Concepto[]} conceptos
 * @param {import('@prisma/client').ConfiguracionEmpresa} empresa
 * @returns {Promise<Uint8Array>}
 */
export async function generarPDF(cotizacion, cliente, conceptos, empresa) {
	const pdfDoc = await PDFDocument.create();
	const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
	const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
	const logo = await cargarLogo(pdfDoc, empresa.logo);

	let ctx = crearPagina(pdfDoc, fontRegular, fontBold);
	ctx = dibujarEncabezado(ctx, cotizacion, empresa, logo);
	ctx = dibujarCliente(ctx, cliente);

	const conceptosOrdenados = [...conceptos].sort((a, b) => a.orden - b.orden);
	const tabla = dibujarEncabezadoTabla(ctx, pdfDoc);
	ctx = dibujarConceptos(tabla.ctx, pdfDoc, conceptosOrdenados, tabla.columnas, tabla.alturaFila);
	ctx = dibujarTotales(ctx, pdfDoc, cotizacion);
	ctx = dibujarObservaciones(ctx, pdfDoc, cotizacion.observaciones);

	for (const page of pdfDoc.getPages()) {
		dibujarPie(page, fontRegular);
	}

	return pdfDoc.save();
}

import { Resend } from 'resend';
import { logger } from '$lib/server/logger.js';
import {
	construirRemitenteCorreo,
	obtenerConfiguracionEmpresa
} from '$lib/server/configuracion.js';
import { generarPDF } from '$lib/server/pdf/cotizacion.js';
import {
	generarHtmlCotizacion,
	generarTextoPlanoCotizacion
} from '$lib/server/email/plantillas.js';

/**
 * @param {import('@prisma/client').Cotizacion & {
 *   cliente: import('@prisma/client').Cliente,
 *   conceptos: import('@prisma/client').Concepto[]
 * }} cotizacion
 */
export async function enviarCotizacion(cotizacion) {
	const apiKey = process.env.RESEND_API_KEY?.trim();
	if (!apiKey) {
		throw new Error('El servicio de correo no está configurado. Contacta al administrador.');
	}

	const emailCliente = cotizacion.cliente.email?.trim();
	if (!emailCliente) {
		throw new Error('El cliente no tiene correo electrónico registrado.');
	}

	const empresa = await obtenerConfiguracionEmpresa();
	const pdfBytes = await generarPDF(cotizacion, cotizacion.cliente, cotizacion.conceptos, empresa);
	if (!pdfBytes?.length) {
		throw new Error('No se pudo generar el PDF de la cotización.');
	}

	const resend = new Resend(apiKey);
	const remitente = process.env.RESEND_FROM_EMAIL?.trim() || construirRemitenteCorreo(empresa);
	const html = generarHtmlCotizacion({
		cotizacion,
		cliente: cotizacion.cliente,
		conceptos: cotizacion.conceptos,
		empresa
	});

	const { error } = await resend.emails.send({
		from: remitente,
		to: emailCliente,
		subject: `Cotización ${cotizacion.folio}`,
		html,
		text: generarTextoPlanoCotizacion(cotizacion, empresa),
		attachments: [
			{
				filename: `${cotizacion.folio}.pdf`,
				content: Buffer.from(pdfBytes)
			}
		]
	});

	if (error) {
		logger.resend('enviarCotizacion', error, { folio: cotizacion.folio });
		const mensaje =
			typeof error.message === 'string' && error.message.trim()
				? error.message
				: 'No se pudo enviar el correo. Verifica la configuración e intenta nuevamente.';
		throw new Error(mensaje);
	}
}

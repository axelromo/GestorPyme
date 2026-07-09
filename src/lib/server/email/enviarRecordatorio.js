import { Resend } from 'resend';
import { logger } from '$lib/server/logger.js';
import { construirRemitenteCorreo, obtenerConfiguracionEmpresa } from '$lib/server/configuracion.js';
import { generarHtmlRecordatorio } from '$lib/server/email/plantillas.js';
import { formatearMoneda } from '$lib/cotizaciones/calculos.js';

/**
 * @param {{
 *   cotizacion: import('@prisma/client').Cotizacion & { cliente: import('@prisma/client').Cliente },
 *   saldo: number,
 *   diasTranscurridos: number
 * }} datos
 */
export async function enviarRecordatorioCobranza({ cotizacion, saldo, diasTranscurridos }) {
	const apiKey = process.env.RESEND_API_KEY?.trim();
	if (!apiKey) {
		throw new Error('El servicio de correo no está configurado. Contacta al administrador.');
	}

	const emailCliente = cotizacion.cliente.email?.trim();
	if (!emailCliente) {
		throw new Error('El cliente no tiene correo electrónico registrado.');
	}

	const empresa = await obtenerConfiguracionEmpresa();
	const resend = new Resend(apiKey);
	const remitente = process.env.RESEND_FROM_EMAIL?.trim() || construirRemitenteCorreo(empresa);
	const html = generarHtmlRecordatorio({ cotizacion, cliente: cotizacion.cliente, empresa, saldo, diasTranscurridos });

	const { error } = await resend.emails.send({
		from: remitente,
		to: emailCliente,
		subject: `Recordatorio de pago — Cotización ${cotizacion.folio}`,
		html,
		text: `Estimado/a ${cotizacion.cliente.nombre},

Le recordamos que la cotización ${cotizacion.folio} tiene un saldo pendiente de ${formatearMoneda(saldo)}.

Gracias por su preferencia.
${empresa.nombreEmpresa?.trim() || 'GestorPyme'}`
	});

	if (error) {
		logger.resend('enviarRecordatorio', error, { folio: cotizacion.folio });
		const mensaje =
			typeof error.message === 'string' && error.message.trim()
				? error.message
				: 'No se pudo enviar el recordatorio. Verifica la configuración e intenta nuevamente.';
		throw new Error(mensaje);
	}
}

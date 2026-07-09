import { formatearMoneda } from '$lib/cotizaciones/calculos.js';
import { formatearDireccionEmpresa } from '$lib/server/configuracion.js';

const COLOR_PRIMARIO = '#2563eb';
const COLOR_TEXTO = '#0f172a';
const COLOR_MUTED = '#64748b';
const COLOR_BORDE = '#e2e8f0';

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
 * @param {import('@prisma/client').ConfiguracionEmpresa} empresa
 */
function obtenerNombreEmpresa(empresa) {
	return empresa.nombreEmpresa?.trim() || 'Mi Empresa';
}

/**
 * @param {{
 *   cotizacion: import('@prisma/client').Cotizacion,
 *   cliente: import('@prisma/client').Cliente,
 *   conceptos: import('@prisma/client').Concepto[],
 *   empresa: import('@prisma/client').ConfiguracionEmpresa
 * }} datos
 */
export function generarHtmlCotizacion({ cotizacion, cliente, conceptos, empresa }) {
	const nombreEmpresa = obtenerNombreEmpresa(empresa);
	const direccion = formatearDireccionEmpresa(empresa);
	const logo = empresa.logo?.trim();
	const conceptosOrdenados = [...conceptos].sort((a, b) => a.orden - b.orden);

	const filasConceptos = conceptosOrdenados
		.map(
			(concepto) => `
			<tr>
				<td style="padding:10px 12px;border-bottom:1px solid ${COLOR_BORDE};color:${COLOR_TEXTO};">${concepto.descripcion}</td>
				<td style="padding:10px 12px;border-bottom:1px solid ${COLOR_BORDE};text-align:right;color:${COLOR_TEXTO};">${Number(concepto.cantidad)}</td>
				<td style="padding:10px 12px;border-bottom:1px solid ${COLOR_BORDE};text-align:right;color:${COLOR_TEXTO};">${formatearMoneda(Number(concepto.precioUnitario))}</td>
				<td style="padding:10px 12px;border-bottom:1px solid ${COLOR_BORDE};text-align:right;color:${COLOR_TEXTO};font-weight:600;">${formatearMoneda(Number(concepto.importe))}</td>
			</tr>`
		)
		.join('');

	return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
	<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:24px 12px;">
		<tr><td align="center">
			<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${COLOR_BORDE};">
				<tr>
					<td style="background:${COLOR_PRIMARIO};padding:24px 28px;color:#ffffff;">
						<table width="100%"><tr>
							<td>
								${logo ? `<img src="${logo}" alt="${nombreEmpresa}" style="max-height:48px;margin-bottom:12px;display:block;" />` : ''}
								<h1 style="margin:0;font-size:22px;font-weight:700;">${nombreEmpresa}</h1>
								${direccion ? `<p style="margin:8px 0 0;font-size:13px;opacity:0.9;">${direccion}</p>` : ''}
							</td>
							<td align="right" style="vertical-align:top;">
								<p style="margin:0;font-size:12px;opacity:0.85;text-transform:uppercase;letter-spacing:0.05em;">Cotización</p>
								<p style="margin:4px 0 0;font-size:20px;font-weight:700;">${cotizacion.folio}</p>
							</td>
						</tr></table>
					</td>
				</tr>
				<tr>
					<td style="padding:28px;">
						<p style="margin:0 0 16px;color:${COLOR_TEXTO};font-size:15px;line-height:1.6;">
							Estimado/a <strong>${cliente.nombre}</strong>,
						</p>
						<p style="margin:0 0 24px;color:${COLOR_MUTED};font-size:14px;line-height:1.6;">
							Adjuntamos el detalle de su cotización. A continuación encontrará el resumen de conceptos.
						</p>
						<table width="100%" style="margin-bottom:20px;font-size:13px;color:${COLOR_MUTED};">
							<tr>
								<td><strong style="color:${COLOR_TEXTO};">Fecha:</strong> ${formatearFecha(cotizacion.fecha)}</td>
								<td align="right"><strong style="color:${COLOR_TEXTO};">Vigencia:</strong> ${formatearFecha(cotizacion.fechaVencimiento)}</td>
							</tr>
						</table>
						<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${COLOR_BORDE};border-radius:8px;overflow:hidden;margin-bottom:20px;">
							<thead>
								<tr style="background:#f8fafc;">
									<th align="left" style="padding:10px 12px;font-size:12px;color:${COLOR_MUTED};text-transform:uppercase;">Descripción</th>
									<th align="right" style="padding:10px 12px;font-size:12px;color:${COLOR_MUTED};text-transform:uppercase;">Cant.</th>
									<th align="right" style="padding:10px 12px;font-size:12px;color:${COLOR_MUTED};text-transform:uppercase;">Precio</th>
									<th align="right" style="padding:10px 12px;font-size:12px;color:${COLOR_MUTED};text-transform:uppercase;">Importe</th>
								</tr>
							</thead>
							<tbody>${filasConceptos}</tbody>
						</table>
						<table width="100%" cellpadding="0" cellspacing="0">
							<tr><td align="right">
								<table style="min-width:220px;">
									<tr><td style="padding:4px 0;color:${COLOR_MUTED};font-size:14px;">Subtotal</td><td align="right" style="padding:4px 0;color:${COLOR_TEXTO};font-size:14px;">${formatearMoneda(Number(cotizacion.subtotal))}</td></tr>
									<tr><td style="padding:4px 0;color:${COLOR_MUTED};font-size:14px;">IVA</td><td align="right" style="padding:4px 0;color:${COLOR_TEXTO};font-size:14px;">${formatearMoneda(Number(cotizacion.iva))}</td></tr>
									<tr><td style="padding:8px 0 4px;color:${COLOR_TEXTO};font-size:16px;font-weight:700;">Total</td><td align="right" style="padding:8px 0 4px;color:${COLOR_PRIMARIO};font-size:18px;font-weight:700;">${formatearMoneda(Number(cotizacion.total))}</td></tr>
								</table>
							</td></tr>
						</table>
					</td>
				</tr>
				<tr>
					<td style="padding:20px 28px;background:#f8fafc;border-top:1px solid ${COLOR_BORDE};text-align:center;">
						<p style="margin:0 0 4px;color:${COLOR_TEXTO};font-size:14px;font-weight:600;">Gracias por su preferencia</p>
						<p style="margin:0;color:${COLOR_MUTED};font-size:12px;">${nombreEmpresa}${empresa.correo?.trim() ? ` · ${empresa.correo.trim()}` : ''}${empresa.telefono?.trim() ? ` · ${empresa.telefono.trim()}` : ''}</p>
					</td>
				</tr>
			</table>
		</td></tr>
	</table>
</body>
</html>`;
}

/**
 * @param {{
 *   cotizacion: { folio: string, total: import('@prisma/client/runtime/library').Decimal | number, fecha: Date, fechaVencimiento: Date | null },
 *   cliente: import('@prisma/client').Cliente,
 *   empresa: import('@prisma/client').ConfiguracionEmpresa,
 *   saldo: number,
 *   diasTranscurridos: number
 * }} datos
 */
export function generarHtmlRecordatorio({ cotizacion, cliente, empresa, saldo, diasTranscurridos }) {
	const nombreEmpresa = obtenerNombreEmpresa(empresa);

	return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
	<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:24px 12px;">
		<tr><td align="center">
			<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;border:1px solid ${COLOR_BORDE};">
				<tr>
					<td style="background:${COLOR_PRIMARIO};padding:24px 28px;color:#ffffff;">
						<h1 style="margin:0;font-size:20px;">Recordatorio de pago</h1>
						<p style="margin:8px 0 0;font-size:14px;opacity:0.9;">${nombreEmpresa}</p>
					</td>
				</tr>
				<tr>
					<td style="padding:28px;color:${COLOR_TEXTO};font-size:14px;line-height:1.6;">
						<p style="margin:0 0 16px;">Estimado/a <strong>${cliente.nombre}</strong>,</p>
						<p style="margin:0 0 20px;color:${COLOR_MUTED};">
							Le recordamos que la cotización <strong>${cotizacion.folio}</strong> tiene un saldo pendiente de pago.
						</p>
						<table width="100%" style="background:#f8fafc;border:1px solid ${COLOR_BORDE};border-radius:8px;margin-bottom:20px;">
							<tr><td style="padding:16px;">
								<p style="margin:0 0 8px;"><strong>Saldo pendiente:</strong> <span style="color:${COLOR_PRIMARIO};font-size:18px;font-weight:700;">${formatearMoneda(saldo)}</span></p>
								<p style="margin:0 0 8px;"><strong>Total de la cotización:</strong> ${formatearMoneda(Number(cotizacion.total))}</p>
								<p style="margin:0 0 8px;"><strong>Fecha:</strong> ${formatearFecha(cotizacion.fecha)}</p>
								<p style="margin:0;"><strong>Días transcurridos:</strong> ${diasTranscurridos}</p>
							</td></tr>
						</table>
						<p style="margin:0;color:${COLOR_MUTED};">Quedamos atentos para cualquier duda o aclaración.</p>
					</td>
				</tr>
				<tr>
					<td style="padding:20px 28px;background:#f8fafc;border-top:1px solid ${COLOR_BORDE};text-align:center;color:${COLOR_MUTED};font-size:12px;">
						${nombreEmpresa}${empresa.correo?.trim() ? ` · ${empresa.correo.trim()}` : ''}
					</td>
				</tr>
			</table>
		</td></tr>
	</table>
</body>
</html>`;
}

/**
 * @param {import('@prisma/client').Cotizacion & { cliente: import('@prisma/client').Cliente, conceptos: import('@prisma/client').Concepto[] }} cotizacion
 * @param {import('@prisma/client').ConfiguracionEmpresa} empresa
 */
export function generarTextoPlanoCotizacion(cotizacion, empresa) {
	const nombreEmpresa = obtenerNombreEmpresa(empresa);
	return `Estimado/a ${cotizacion.cliente.nombre},

Adjuntamos la cotización ${cotizacion.folio} de ${nombreEmpresa}.

Total: ${formatearMoneda(Number(cotizacion.total))}
Vigencia: ${formatearFecha(cotizacion.fechaVencimiento)}

Gracias por su preferencia.`;
}

import prisma from '$lib/server/prisma.js';

/**
 * @param {import('@prisma/client').ConfiguracionEmpresa} empresa
 */
export function formatearDireccionEmpresa(empresa) {
	const partes = [
		empresa.direccion,
		empresa.ciudad,
		empresa.estado,
		empresa.codigoPostal ? `CP ${empresa.codigoPostal}` : null
	].filter((parte) => parte?.trim());

	return partes.join(', ');
}

/**
 * @param {import('@prisma/client').ConfiguracionEmpresa} empresa
 */
export function construirRemitenteCorreo(empresa) {
	const nombre = empresa.nombreEmpresa?.trim() || 'GestorPyme';
	const correo = empresa.correo?.trim() || 'onboarding@resend.dev';
	return `${nombre} <${correo}>`;
}

/**
 * @param {import('@prisma/client').PrismaClient | import('@prisma/client').Prisma.TransactionClient} [clientePrisma]
 */
export async function obtenerConfiguracionEmpresa(clientePrisma = prisma) {
	const existente = await clientePrisma.configuracionEmpresa.findFirst({
		orderBy: { createdAt: 'asc' }
	});

	if (existente) {
		return existente;
	}

	return clientePrisma.configuracionEmpresa.create({
		data: {
			nombreEmpresa: '',
			razonSocial: '',
			rfc: null,
			correo: null,
			telefono: null,
			direccion: null,
			ciudad: null,
			estado: null,
			codigoPostal: null,
			sitioWeb: null,
			logo: null
		}
	});
}

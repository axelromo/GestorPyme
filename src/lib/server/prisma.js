import { PrismaClient } from '@prisma/client';

/** @type {{ prisma?: PrismaClient }} */
const globalForPrisma = globalThis;

function crearPrismaClient() {
	return new PrismaClient();
}

/** @param {PrismaClient | undefined} cliente */
function esClientePrismaValido(cliente) {
	return typeof cliente?.configuracionEmpresa?.findFirst === 'function';
}

let prisma = globalForPrisma.prisma;

if (!esClientePrismaValido(prisma)) {
	prisma = crearPrismaClient();

	if (process.env.NODE_ENV !== 'production') {
		globalForPrisma.prisma = prisma;
	}
}

export default prisma;

import prisma from '$lib/server/prisma.js';
import { obtenerConfiguracionEmpresa } from '$lib/server/configuracion.js';
import { ESTADOS_COTIZACION, ETIQUETAS_ESTADO } from '$lib/cotizaciones/estado.js';
import {
	agruparSaldoPorCliente,
	calcularCarteraPendiente,
	serializarFilaCobranza
} from '$lib/server/cobranza.js';
import { formatearMoneda } from '$lib/cotizaciones/calculos.js';
import { manejarErrorCarga } from '$lib/server/manejoErrores.js';

/**
 * @returns {Array<{ clave: string, etiqueta: string }>}
 */
function obtenerUltimos12Meses() {
	const referencia = new Date();
	/** @type {Array<{ clave: string, etiqueta: string }>} */
	const meses = [];

	for (let indice = 11; indice >= 0; indice -= 1) {
		const fecha = new Date(referencia.getFullYear(), referencia.getMonth() - indice, 1);
		const mes = String(fecha.getMonth() + 1).padStart(2, '0');

		meses.push({
			clave: `${fecha.getFullYear()}-${mes}`,
			etiqueta: fecha.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' })
		});
	}

	return meses;
}

/**
 * @param {Array<{ fecha: Date }>} cotizaciones
 * @param {Array<{ clave: string, etiqueta: string }>} meses
 */
function agruparCotizacionesPorMes(cotizaciones, meses) {
	/** @type {Record<string, number>} */
	const conteo = Object.fromEntries(meses.map((mes) => [mes.clave, 0]));

	for (const cotizacion of cotizaciones) {
		const fecha = cotizacion.fecha;
		const clave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
		if (clave in conteo) {
			conteo[clave] += 1;
		}
	}

	return meses.map((mes) => conteo[mes.clave]);
}

/**
 * @param {Array<{ estado: string, _count: { _all: number } }>} agrupado
 */
function normalizarCotizacionesPorEstado(agrupado) {
	/** @type {Record<string, number>} */
	const conteo = Object.fromEntries(ESTADOS_COTIZACION.map((estado) => [estado, 0]));

	for (const fila of agrupado) {
		conteo[fila.estado] = fila._count._all;
	}

	return ESTADOS_COTIZACION.map((estado) => ({
		estado,
		etiqueta: ETIQUETAS_ESTADO[estado] ?? estado,
		cantidad: conteo[estado]
	}));
}

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	try {
		const meses = obtenerUltimos12Meses();
		const [anio, mes] = meses[0].clave.split('-').map(Number);
		const desde = new Date(anio, mes - 1, 1);

		const [
			empresa,
			totalClientes,
			totalCotizaciones,
			totalPagos,
			clientesActivos,
			totalCotizadoAgg,
			totalPagadoAgg,
			porEstado,
			fechasCotizaciones,
			ultimasCotizaciones,
			cotizacionesCobranza
		] = await Promise.all([
			obtenerConfiguracionEmpresa(),
			prisma.cliente.count(),
			prisma.cotizacion.count(),
			prisma.pago.count(),
			prisma.cliente.count({ where: { activo: true } }),
			prisma.cotizacion.aggregate({ _sum: { total: true } }),
			prisma.pago.aggregate({ _sum: { monto: true } }),
			prisma.cotizacion.groupBy({
				by: ['estado'],
				_count: { _all: true }
			}),
			prisma.cotizacion.findMany({
				select: { fecha: true },
				where: { fecha: { gte: desde } }
			}),
			prisma.cotizacion.findMany({
				take: 5,
				orderBy: { createdAt: 'desc' },
				include: {
					cliente: { select: { nombre: true, empresa: true } }
				}
			}),
			prisma.cotizacion.findMany({
				where: { estado: { in: ['APROBADA', 'FACTURADA'] } },
				include: {
					cliente: { select: { id: true, nombre: true, empresa: true, email: true } },
					pagos: { select: { monto: true } }
				}
			})
		]);

		const cotizacionesPorEstado = normalizarCotizacionesPorEstado(porEstado);
		const cotizacionesPorMes = agruparCotizacionesPorMes(fechasCotizaciones, meses);
		const sinDatos = totalClientes === 0 && totalCotizaciones === 0 && totalPagos === 0;

		const filasCobranza = cotizacionesCobranza
			.map(serializarFilaCobranza)
			.filter((fila) => fila.saldo > 0);
		const carteraPendiente = calcularCarteraPendiente(filasCobranza);
		const topClientesSaldo = agruparSaldoPorCliente(filasCobranza, 5);

		return {
			nombreEmpresa: empresa.nombreEmpresa?.trim() || null,
			sinDatos,
			metricas: {
				totalClientes,
				totalCotizaciones,
				clientesActivos,
				totalCotizado: Number(totalCotizadoAgg._sum.total ?? 0),
				totalPagado: Number(totalPagadoAgg._sum.monto ?? 0),
				carteraPendiente,
				cotizacionesPorEstado
			},
			widgets: {
				ultimasCotizaciones: ultimasCotizaciones.map((cotizacion) => ({
					folio: cotizacion.folio,
					folioHref: `/cotizaciones/${cotizacion.id}`,
					cliente: cotizacion.cliente.empresa
						? `${cotizacion.cliente.nombre} (${cotizacion.cliente.empresa})`
						: cotizacion.cliente.nombre,
					estado: ETIQUETAS_ESTADO[cotizacion.estado] ?? cotizacion.estado,
					total: formatearMoneda(Number(cotizacion.total))
				})),
				topClientesSaldo: topClientesSaldo.map((cliente) => ({
					cliente: cliente.clienteNombre,
					clienteHref: `/clientes/${cliente.clienteId}`,
					saldo: cliente.saldoFormateado
				}))
			},
			graficas: {
				cotizacionesPorMes: {
					labels: meses.map((mes) => mes.etiqueta),
					data: cotizacionesPorMes
				},
				cotizacionesPorEstado: {
					labels: cotizacionesPorEstado.map((fila) => fila.etiqueta),
					data: cotizacionesPorEstado.map((fila) => fila.cantidad)
				}
			}
		};
	} catch (err) {
		manejarErrorCarga('dashboard.load', err, 'No se pudo cargar el dashboard.');
	}
}

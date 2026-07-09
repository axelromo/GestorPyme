-- CreateEnum
CREATE TYPE "EstadoCotizacion" AS ENUM ('BORRADOR', 'ENVIADA', 'APROBADA', 'RECHAZADA', 'FACTURADA', 'PAGADA');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'TRANSFERENCIA', 'TARJETA', 'CHEQUE', 'OTRO');

-- CreateEnum
CREATE TYPE "AccionHistorial" AS ENUM ('CREADA', 'EDITADA', 'ENVIADA', 'APROBADA', 'RECHAZADA', 'FACTURADA', 'PAGO_REGISTRADO', 'CANCELADA');

-- CreateTable
CREATE TABLE "clientes" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "empresa" TEXT,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT,
    "rfc" TEXT,
    "notas" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cotizaciones" (
    "id" UUID NOT NULL,
    "folio" TEXT NOT NULL,
    "cliente_id" UUID NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_vencimiento" TIMESTAMP(3),
    "moneda" TEXT NOT NULL DEFAULT 'MXN',
    "tasa_iva" DECIMAL(4,2) NOT NULL DEFAULT 0.16,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "iva" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "estado" "EstadoCotizacion" NOT NULL DEFAULT 'BORRADOR',
    "observaciones" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cotizaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conceptos" (
    "id" UUID NOT NULL,
    "cotizacion_id" UUID NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad" DECIMAL(12,4) NOT NULL,
    "precio_unitario" DECIMAL(12,2) NOT NULL,
    "descuento" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "importe" DECIMAL(12,2) NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "conceptos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" UUID NOT NULL,
    "cotizacion_id" UUID NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto" DECIMAL(12,2) NOT NULL,
    "metodo" "MetodoPago" NOT NULL,
    "referencia" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial" (
    "id" UUID NOT NULL,
    "cotizacion_id" UUID NOT NULL,
    "accion" "AccionHistorial" NOT NULL,
    "descripcion" TEXT,
    "usuario_id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clientes_email_idx" ON "clientes"("email");

-- CreateIndex
CREATE INDEX "clientes_empresa_idx" ON "clientes"("empresa");

-- CreateIndex
CREATE INDEX "clientes_activo_idx" ON "clientes"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "cotizaciones_folio_key" ON "cotizaciones"("folio");

-- CreateIndex
CREATE INDEX "cotizaciones_cliente_id_idx" ON "cotizaciones"("cliente_id");

-- CreateIndex
CREATE INDEX "cotizaciones_estado_idx" ON "cotizaciones"("estado");

-- CreateIndex
CREATE INDEX "cotizaciones_fecha_idx" ON "cotizaciones"("fecha");

-- CreateIndex
CREATE INDEX "conceptos_cotizacion_id_idx" ON "conceptos"("cotizacion_id");

-- CreateIndex
CREATE INDEX "pagos_cotizacion_id_idx" ON "pagos"("cotizacion_id");

-- CreateIndex
CREATE INDEX "pagos_fecha_idx" ON "pagos"("fecha");

-- CreateIndex
CREATE INDEX "historial_cotizacion_id_idx" ON "historial"("cotizacion_id");

-- CreateIndex
CREATE INDEX "historial_fecha_idx" ON "historial"("fecha");

-- CreateIndex
CREATE INDEX "historial_accion_idx" ON "historial"("accion");

-- AddForeignKey
ALTER TABLE "cotizaciones" ADD CONSTRAINT "cotizaciones_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conceptos" ADD CONSTRAINT "conceptos_cotizacion_id_fkey" FOREIGN KEY ("cotizacion_id") REFERENCES "cotizaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_cotizacion_id_fkey" FOREIGN KEY ("cotizacion_id") REFERENCES "cotizaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial" ADD CONSTRAINT "historial_cotizacion_id_fkey" FOREIGN KEY ("cotizacion_id") REFERENCES "cotizaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

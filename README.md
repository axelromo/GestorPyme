# GestorPyme

Sistema de gestión para pequeñas y medianas empresas (PYME). Permite administrar clientes, cotizaciones, pagos, generar PDFs, enviar cotizaciones por correo y visualizar un dashboard ejecutivo.

## Stack tecnológico

- **Frontend / Backend:** SvelteKit 2 + Svelte 5
- **Base de datos:** PostgreSQL (Supabase) + Prisma ORM
- **Autenticación:** Clerk
- **Correo:** Resend
- **PDF:** pdf-lib

## Requisitos previos

- Node.js 20+
- npm 10+
- Cuenta en [Supabase](https://supabase.com) (PostgreSQL)
- Cuenta en [Clerk](https://clerk.com)
- Cuenta en [Resend](https://resend.com) (opcional, para envío de cotizaciones)

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd GestorPyme

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Generar cliente Prisma y aplicar migraciones
npx prisma generate
npx prisma db push
```

## Variables de entorno

Copia `.env.example` a `.env` y completa los valores:

| Variable                                     | Descripción                                                    |
| -------------------------------------------- | -------------------------------------------------------------- |
| `DATABASE_URL`                               | URL de conexión PostgreSQL (pooler Supabase, modo transacción) |
| `DIRECT_URL`                                 | URL directa PostgreSQL (migraciones, modo sesión)              |
| `PUBLIC_CLERK_PUBLISHABLE_KEY`               | Clave pública de Clerk                                         |
| `CLERK_SECRET_KEY`                           | Clave secreta de Clerk                                         |
| `PUBLIC_CLERK_SIGN_IN_URL`                   | Ruta de inicio de sesión (`/sign-in`)                          |
| `PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | Redirección tras login (`/dashboard`)                          |
| `PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | Redirección tras registro (`/dashboard`)                       |
| `RESEND_API_KEY`                             | API key de Resend para envío de correos                        |
| `RESEND_FROM_EMAIL`                          | Remitente opcional (ej. `Mi Empresa <correo@dominio.com>`)     |

## Prisma

```bash
# Generar cliente después de cambios en schema.prisma
npx prisma generate

# Aplicar schema a la base de datos
npx prisma db push

# Abrir Prisma Studio (explorar datos)
npx prisma studio
```

El schema define los modelos: `Cliente`, `Cotizacion`, `Concepto`, `Pago`, `HistorialCotizacion`, `ConfiguracionEmpresa`.

## Clerk

1. Crea una aplicación en [dashboard.clerk.com](https://dashboard.clerk.com).
2. Copia las API Keys a `.env`.
3. Configura las URLs de redirección en Clerk:
   - Sign-in URL: `http://localhost:5173/sign-in` (desarrollo)
   - After sign-in: `/dashboard`
4. Las rutas protegidas están bajo `(app)/` y requieren sesión activa.

## Resend

1. Crea una API key en [resend.com/api-keys](https://resend.com/api-keys).
2. Agrega `RESEND_API_KEY` a `.env`.
3. Para producción, verifica tu dominio en Resend y configura `RESEND_FROM_EMAIL`.
4. Sin Resend configurado, el envío de cotizaciones mostrará un mensaje amigable sin romper la app.

## Supabase

1. Crea un proyecto en Supabase.
2. En **Settings → Database**, copia las connection strings:
   - **Transaction pooler** → `DATABASE_URL` (puerto 6543, `?pgbouncer=true`)
   - **Session pooler** o direct → `DIRECT_URL` (puerto 5432)

## Desarrollo

```bash
npm run dev

# Abrir en el navegador
npm run dev -- --open
```

La app estará disponible en `http://localhost:5173`.

## Build de producción

```bash
npm run build
npm run preview
```

Para desplegar, instala el adapter adecuado según tu plataforma:

```bash
# Ejemplo: Vercel
npm i -D @sveltejs/adapter-vercel
```

Actualiza `svelte.config.js` con el adapter correspondiente. Consulta la [documentación de adapters](https://svelte.dev/docs/kit/adapters).

## Despliegue

### Checklist pre-despliegue

- [ ] Variables de entorno configuradas en el hosting
- [ ] `npx prisma db push` ejecutado contra la BD de producción
- [ ] Dominio verificado en Clerk (URLs de producción)
- [ ] Dominio verificado en Resend (si usas correo)
- [ ] `npm run build` sin errores

### Plataformas recomendadas

- **Vercel** — adapter-vercel, variables en dashboard
- **Netlify** — adapter-netlify
- **Railway / Render** — adapter-node

Configura `DATABASE_URL` y `DIRECT_URL` apuntando a Supabase en producción.

## Scripts disponibles

| Comando           | Descripción            |
| ----------------- | ---------------------- |
| `npm run dev`     | Servidor de desarrollo |
| `npm run build`   | Build de producción    |
| `npm run preview` | Previsualizar build    |
| `npm run lint`    | ESLint + Prettier      |
| `npm run format`  | Formatear código       |

## Estructura del proyecto

```
src/
├── lib/
│   ├── components/     # Componentes UI y de dominio
│   ├── server/         # Lógica servidor (Prisma, PDF, email, logger)
│   ├── ui/             # Utilidades de UI (listado, mensajes, forms)
│   └── validaciones/   # Validación de formularios
├── routes/
│   ├── (app)/          # Rutas protegidas (dashboard, clientes, etc.)
│   └── sign-in/        # Autenticación Clerk
└── hooks.server.js     # Auth + manejo global de errores
```

## Licencia

Proyecto privado — uso interno.

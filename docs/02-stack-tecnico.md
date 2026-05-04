# Mesa.pe — Stack Técnico

## 1. Decisión General

Se construye con un stack moderno, type-safe y escalable que permita:

- Desarrollo rápido de MVP.
- Portafolio técnico robusto (fullstack).
- Escalabilidad futura sin reescrituras masivas.

## 2. Stack Completo

| Capa               | Tecnología                                    | Justificación                                                                                                       |
| ------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Monorepo**       | `pnpm` workspaces                             | Gestión eficiente de dependencias entre frontend y backend.                                                         |
| **Frontend**       | Next.js 14+ (App Router) + React + TypeScript | SSR/SSG para SEO, rutas dinámicas para páginas públicas (`/{slug}`), una sola codebase para dashboard y storefront. |
| **Backend**        | NestJS + TypeScript                           | Arquitectura modular, inyección de dependencias, ideal para API profesional y escalabilidad futura.                 |
| **Base de Datos**  | PostgreSQL (Neon)                             | Serverless, escalable, ideal para desarrollo y producción sin gestión de servidor.                                  |
| **ORM**            | Prisma                                        | Type-safe, migraciones automáticas, excelente developer experience.                                                 |
| **Cache / Jobs**   | Redis (Upstash) + BullMQ                      | Procesamiento en segundo plano para analytics y optimización de imágenes.                                           |
| **Almacenamiento** | Cloudflare R2                                 | Compatible S3, costos bajos de egress, ideal para fotos de productos, logos y QR.                                   |
| **Autenticación**  | Clerk                                         | Login listo, soporte multi-tenant (organizaciones), webhooks para sincronización con backend.                       |
| **UI**             | Tailwind CSS + shadcn/ui                      | Componentes editables, rápido, consistente, diseño moderno.                                                         |
| **Analítica**      | PostHog (Producto) + PostgreSQL (Dashboard)   | Funnels y session replay en PostHog; métricas del negocio en el dashboard propio del SaaS.                          |
| **Monitoreo**      | Sentry + Vercel Analytics                     | Observabilidad y tracking de errores desde el día 1.                                                                |
| **Deployment**     | Vercel (Web) + Railway (API) + Neon (DB)      | Rápido, confiable y económico para escalar desde MVP hasta crecimiento.                                             |

## 3. Librerías Frontend Detalladas

| Necesidad      | Librería           |
| -------------- | ------------------ |
| Framework      | Next.js App Router |
| Estilos        | Tailwind CSS       |
| Componentes UI | shadcn/ui          |
| Iconos         | lucide-react       |
| Formularios    | React Hook Form    |
| Validación     | Zod                |
| Data fetching  | TanStack Query     |
| Estado local   | Zustand            |
| Tablas         | TanStack Table     |
| Gráficos       | Recharts           |
| Drag & drop    | dnd-kit            |
| QR             | qrcode.react       |
| Notificaciones | sonner             |
| Fechas         | date-fns           |

## 4. Librerías Backend Detalladas

| Necesidad         | Librería                            |
| ----------------- | ----------------------------------- |
| Framework         | NestJS                              |
| ORM               | Prisma                              |
| Validación DTO    | class-validator + class-transformer |
| Documentación API | Swagger (@nestjs/swagger)           |
| Jobs/Colas        | BullMQ                              |
| Logs              | pino                                |
| Seguridad         | Helmet, CORS, rate limiting         |

## 5. Cuentas y Servicios a Crear

- [ ] Clerk (auth)
- [ ] Neon (PostgreSQL)
- [ ] Upstash (Redis)
- [ ] Cloudflare R2 (storage)
- [ ] Vercel (frontend hosting)
- [ ] Railway (backend hosting)
- [ ] Sentry (monitoreo)
- [ ] PostHog (analytics)
- [ ] Dominio `mesa.pe` (o similar)

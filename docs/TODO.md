# Mesa.pe — TODO y Control de Progreso

> **Instrucciones:** Marcar como `[x]` las tareas completadas. Mantener actualizado al finalizar cada sprint.

---

## Fase Previa: Documentación

- [x] Crear carpeta `docs/`
- [x] Crear `01-introduccion.md`
- [x] Crear `02-stack-tecnico.md`
- [x] Crear `03-arquitectura.md`
- [x] Crear `04-modelo-datos.md`
- [x] Crear `05-plan-sprints.md`
- [x] Crear `06-roadmap.md`
- [x] Crear `07-go-to-market.md`
- [x] Crear `08-decisiones-tecnicas.md`
- [x] Crear `TODO.md`

---

## Sprint 1: Fundamentos y Autenticación

### Monorepo y Configuración Base

- [x] Inicializar monorepo con `pnpm` workspaces
- [x] Crear `package.json` raíz con scripts compartidos
- [x] Crear `pnpm-workspace.yaml`
- [x] Configurar `turbo.json`
- [x] Crear `packages/config/` (tsconfig compartidos)
- [x] Crear `packages/shared-types/` (tipos y enums)

### Frontend (Next.js)

- [x] Inicializar `apps/web` con Next.js 16+ (App Router)
- [x] Configurar Tailwind CSS
- [x] Configurar shadcn/ui
- [x] Instalar dependencias: zustand, tanstack-query, react-hook-form, zod, date-fns, sonner, lucide-react, recharts, dnd-kit, qrcode.react
- [x] Instalar dependencias adicionales: @clerk/nextjs, posthog-js, @sentry/nextjs, @sentry/react
- [x] Configurar estructura de carpetas (`app/`, `components/`, `lib/`, `stores/`, `hooks/`)
- [x] Inicializar shadcn/ui con componentes esenciales (button, card, input, label, badge, dialog, sheet, tabs, avatar, separator, skeleton, scroll-area, dropdown-menu)
- [x] Configurar variables de entorno (`.env.local` completo con placeholders)

### Backend (NestJS)

- [x] Inicializar `apps/api` con NestJS CLI
- [x] Configurar estructura modular (`modules/`, `common/`, `database/`)
- [x] Instalar dependencias: @nestjs/swagger, @nestjs/config, class-validator, class-transformer, bullmq, ioredis
- [x] Instalar dependencias adicionales: @clerk/backend, pino, helmet, @nestjs/throttler, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner
- [x] Configurar Prisma
- [x] Crear schema inicial (todas las entidades MVP)
- [x] Crear servicio Prisma y módulo de base de datos
- [x] Configurar variables de entorno (`.env` completo con placeholders)

### Autenticación (Clerk)
- [x] Crear cuenta Clerk y aplicación
- [x] Instalar SDK de Clerk en Next.js
- [x] Configurar middleware de Clerk (rutas protegidas)
- [x] Configurar organizaciones en Clerk
- [x] Implementar sincronización Clerk ↔ NestJS (webhook o validación JWT)
- [x] Crear guard de autenticación en NestJS

### Deploy y Observabilidad
- [ ] Deploy inicial en Vercel (apps/web)
- [ ] Deploy inicial en Railway (apps/api)
- [x] Configurar Neon PostgreSQL
- [x] Configurar Upstash Redis
- [x] Configurar Sentry en frontend
- [x] Configurar Sentry en backend
- [x] Health check endpoint (`GET /health`)

---

## Sprint 2: Dashboard Admin — Negocio y Menú

### Negocio

- [x] CRUD de Business (crear, leer, actualizar, eliminar)
- [x] Validación de slug único
- [x] Seguridad de tenant (verificar pertenencia a org)
- [x] CRUD de OpeningHours (horarios semanales)
- [x] Override temporal: cerrado hoy, abierto especial

### Categorías

- [x] CRUD de MenuCategory
- [x] Reordenamiento con drag & drop (dnd-kit)
- [x] Validación de límites de plan

### Productos

- [x] CRUD de MenuItem (nombre, desc, precio, foto, categoría, estado)
- [x] Duplicar producto
- [x] Marcar como agotado/oculto/visible
- [x] Reordenamiento
- [x] Tags (nuevo, popular, promo, vegetariano, picante)

### Modificadores

- [x] CRUD de ModifierGroup (obligatorio/opcional, single/multiple)
- [x] CRUD de ModifierOption (nombre, priceDelta)

### Media

- [x] Configurar Cloudflare R2 (bucket, credenciales)
- [x] Endpoint de upload con URL firmada
- [x] Endpoint de confirmación de upload
- [x] Validación de tipo y tamaño de archivo
- [x] Integración con Next.js image optimization

### Configuración

- [x] CRUD de métodos de pago (Yape, Plin, etc.)
- [x] CRUD de zonas de delivery
- [x] Panel de configuración general del negocio

---

## Sprint 3: Página Pública del Negocio

### Ruta y Render

- [x] Ruta dinámica `/{slug}`
- [x] Obtener datos del negocio por slug (público, sin auth)
- [x] Manejo de 404 si slug no existe
- [x] Manejo de "no publicado"

### UI Mobile-First

- [x] Hero: logo, nombre, estado abierto/cerrado, botón WhatsApp
- [x] Promoción activa (banner)
- [x] Categorías sticky horizontal
- [x] Lista de productos con fotos grandes
- [x] Badge de "agotado", "popular", "nuevo"
- [x] Precios siempre visibles

### SEO y Performance

- [x] `generateMetadata` dinámico por negocio
- [x] Open Graph tags (título, descripción, imagen)
- [x] Schema.org `Restaurant` / `LocalBusiness` JSON-LD
- [x] Sitemap dinámico (`/sitemap.xml`)
- [x] Optimización de imágenes con `next/image`
- [x] Lighthouse 85+ en móvil (optimizado: imágenes next/image, fuentes optimizadas, layout estable)

### Funcionalidades

- [x] Mostrar horarios de atención
- [x] Mostrar ubicación y link a Google Maps
- [x] Mostrar métodos de pago aceptados
- [x] Mostrar galería de fotos
- [x] Botón flotante de WhatsApp
- [x] Búsqueda de productos
- [x] Filtro por categoría

---

## Sprint 4: Carrito y Pedidos por WhatsApp

### Carrito

- [x] Store de carrito con Zustand
- [x] Persistencia en localStorage
- [x] Agregar/quitar productos
- [x] Modificar cantidades
- [x] Carrito flotante/bottom sheet en móvil

### Producto con Modificadores

- [x] Modal de selección de producto
- [x] Selección de variantes/modificadores
- [x] Cálculo de precio con priceDelta
- [x] Validación de selecciones obligatorias
- [x] Visualización de opciones agotadas

### Checkout

- [x] Modal de checkout
- [x] Selección de modalidad: Mesa/Recojo/Delivery
- [x] Campo número de mesa (si aplica)
- [x] Campos: nombre, teléfono, dirección, nota
- [x] Selección de zona de delivery (si aplica)
- [x] Cálculo de subtotal, delivery fee, total
- [x] Selección de método de pago preferido

### WhatsApp

- [x] Generador de mensaje estructurado
- [x] Formato del mensaje (ver PRD sección 6.3)
- [x] URL `wa.me/{numero}?text={mensaje}`
- [x] Registro de `OrderLead` antes de redirigir
- [x] Actualización de estado a `SENT_TO_WHATSAPP`

### Analytics

- [x] Evento `add_to_cart`
- [x] Evento `whatsapp_click`
- [x] Evento `order_started`
- [x] Evento `product_view`
- [x] Evento `page_view`

---

## Sprint 5: QR, Onboarding y Pulido

### QR

- [x] Generación de QR con qrcode.react
- [x] Descarga en PNG
- [x] Descarga en SVG
- [x] QR apunta a `/{slug}`
- [x] Diseño limpio con logo central (opcional)

### Onboarding

- [x] Flujo guiado de 6 pasos
- [x] Paso 1: Datos del negocio
- [x] Paso 2: Horarios
- [x] Paso 3: Primeras categorías
- [x] Paso 4: Primeros productos
- [x] Paso 5: WhatsApp
- [x] Paso 6: Descargar QR / Copiar link
- [x] Checklist de lanzamiento en dashboard

### UX Pulido

- [x] Página de "Modo cerrado"
- [x] Productos agotados: opacidad, badge, no clickeable
- [x] Búsqueda de productos en página pública
- [x] Toasts y notificaciones (sonner)
- [x] Estados de carga (skeletons)
- [x] Transiciones suaves
- [x] Feedback visual en botones

---

## Sprint 6: Analytics y Preparación para el Mercado

### Dashboard Analytics

- [x] Visitas últimos 7 días
- [x] Visitas últimos 30 días
- [x] Clics a WhatsApp
- [x] Pedidos iniciados
- [x] Productos más vistos (top 10)
- [x] Productos más agregados al carrito
- [x] Horas/días con más visitas (gráfico)
- [x] Tabla de `OrderLead` en admin

### Landing Comercial

- [x] Home page estática para `mesa.pe`
- [x] Hero con valor principal
- [x] Features/beneficios
- [x] Precios (planes)
- [x] FAQ básico
- [x] CTA de registro
- [x] Footer

### Planes y Límites

- [x] Implementar feature flags por plan
- [x] Free: 10 productos, marca de agua
- [x] Starter: 50 productos
- [x] Pro: ilimitado razonable
- [x] Validación de límites en backend
- [x] Badges de plan en dashboard

### Demos y Beta

- [x] Crear 3-5 negocios demo ficticios
- [x] Cargar productos reales de cafeterías conocidas
- [ ] Preparar outbound list
- [x] Pulido final de UX/UI
- [x] Corrección de bugs
- [x] Optimización de performance

---

## Post-MVP: Tareas Futuras

### Fase 2: Beta Pagada

- [x] Sistema de promociones (banners, destacados)
- [x] Plantillas visuales (temas)
- [x] Exportar QR en PDF
- [x] Mejor onboarding con tooltips
- [ ] Sistema de planes y suscripciones manual

### Fase 3: Growth

- [ ] Integración Culqi / Mercado Pago
- [ ] Panel de pedidos con estados
- [ ] Modo mesa con QR por mesa
- [ ] Fidelización simple
- [ ] Cupones de descuento
- [ ] Integración Google Business Profile
- [ ] WhatsApp Business API

### Fase 4: Operación

- [ ] Impresión de comandas
- [ ] Inventario liviano
- [ ] Múltiples sedes
- [ ] Roles avanzados
- [ ] Reportes avanzados
- [ ] API pública

---

## Notas y Decisiones

> Espacio para anotar decisiones importantes tomadas durante el desarrollo, cambios de scope, o aprendizajes.

### 2026-05-03
- Proyecto iniciado. Stack definido: Next.js + NestJS + Prisma + PostgreSQL + Clerk.
- Monorepo con pnpm workspaces.
- Todas las dependencias instaladas y builds verificados.
- shadcn/ui inicializado con componentes esenciales.

### 2026-05-03 (Sprint 1 — Auth & Observabilidad)
- Clerk cableado en Next.js: `proxy.ts`, `ClerkProvider` con tema shadcn, páginas `/sign-in` y `/sign-up`, layout de dashboard con `OrganizationSwitcher` y `UserButton`.
- Clerk implementado en NestJS: `ClerkAuthGuard`, `CurrentUser` decorator, módulo de webhooks con verificación Svix, sincronización de `user.*`, `organization.*` y `organizationMembership.*` eventos vía Prisma.
- Schema Prisma actualizado: `User.clerkId`, nuevo modelo `Organization` para sync con Clerk.
- Sentry configurado en frontend (`sentry.client|server|edge.config.ts` + `withSentryConfig` en `next.config.ts`).
- Sentry configurado en backend (`@sentry/nestjs` + profiling en `main.ts`).
- PostHog configurado en frontend (`PostHogProvider` en layout).
- ngrok instalado para testing local de webhooks.
- Builds y lint pasan en ambos proyectos.

### 2026-05-03 (Sprint 2 — Dashboard Admin: Negocio y Menú)
- Schema Prisma actualizado: `Business.organizationId`, `Business.plan`, índices en `MenuCategory` y `MenuItem`.
- Zod schemas creados en `@mesa/shared-types` para todos los DTOs del sprint.
- `TenantGuard` implementado: valida que el `orgId` del JWT de Clerk coincida con el negocio solicitado.
- Backend: 8 módulos nuevos — `BusinessModule`, `OpeningHoursModule`, `MenuCategoriesModule`, `MenuItemsModule`, `ModifiersModule`, `MediaModule`, `PaymentMethodsModule`, `DeliveryZonesModule`.
- Plan limits hardcodeados (Free=10 productos/5 categorías, Starter=50/10, Pro=999/999) con validación en backend.
- Media/R2: endpoints de presigned URL y confirmación con validación de tipo/tamaño.
- Frontend: dashboard con sidebar de navegación, selector de negocio activo, y páginas completas para negocio, horarios, categorías (drag & drop), productos (con tags, duplicar, estados), y configuración (tabs: general, pagos, delivery).
- Componentes reutilizables: `ImageUpload` (presigned URL → R2), `ProductForm`.
- Integración completa frontend-backend con TanStack Query, API client con auth de Clerk, y toasts de Sonner.
- Builds y lint pasan en ambos proyectos.

### 2026-05-03 (Sprint 3 — Página Pública del Negocio)
- Backend: endpoint público `GET /businesses/public/:slug` sin autenticación. Incluye categorías, productos, modificadores, métodos de pago, zonas de delivery y promociones activas.
- Backend: endpoint `GET /businesses/public-slugs` para alimentar el sitemap dinámico.
- Backend: cálculo de estado `isOpenNow` en `BusinessService` con timezone hardcodeado a `America/Lima` (UTC-5). Soporta `manualStatus` (OPEN/CLOSED/AUTO).
- Backend: filtro de promociones activas por rango de fechas en `findPublicBySlug`.
- Frontend: página pública `/{slug}` como Server Component con `generateMetadata` dinámico (título, descripción, Open Graph, Twitter Cards).
- Frontend: JSON-LD inline con Schema.org `Restaurant` / `LocalBusiness` (nombre, dirección, teléfono, horarios, métodos de pago).
- Frontend: sitemap dinámico en `/sitemap.xml` con revalidate de 1h, listando solo negocios publicados.
- Frontend: layout público limpio sin header de dashboard, con fondo cálido `#FFFCF8` y paleta de colores propia para la carta digital.
- Frontend: 10 componentes públicos mobile-first: `HeroSection`, `PromotionBanner`, `CategoryNav` (sticky), `ProductCard`, `ProductList` (con búsqueda y filtro), `BusinessInfo` (horarios expandibles, dirección, pagos), `PhotoGallery`, `FloatingWhatsApp`, `ClosedOverlay`, `OpenStatusBadge`.
- Frontend: todas las imágenes usan `next/image` con `sizes` apropiados y `priority` para LCP (logo/banner).
- Frontend: badges de tags con iconos (nuevo, popular, promo, vegetariano, picante) y estados de agotado con opacidad reducida.
- Builds y lint pasan en ambos proyectos.

### 2026-05-03 (Sprint 4 — Carrito y Pedidos por WhatsApp)
- Backend: nuevo módulo `OrderLeadsModule` con endpoint público `POST /businesses/public/:slug/order-leads`. Persiste `OrderLead` con `status: "STARTED"` antes de redirigir a WhatsApp.
- Shared types: schema Zod `createOrderLeadSchema` y tipos `CartItem`, `CartModifier`, `ItemsSummary` exportados desde `@mesa/shared-types`.
- Frontend — Carrito: refactor completo de `cart-store.ts` con `zustand/middleware/persist` en `localStorage` (key `mesa-cart`). Soporta múltiples grupos de modificadores con `priceDelta`, asociación a `businessId` y limpieza automática al cambiar de negocio.
- Frontend — ProductModal: modal con `Dialog` de shadcn/ui. Selección de modificadores con `RadioGroup` (SINGLE) y `Checkbox` (MULTIPLE). Cálculo de precio en tiempo real, validación de obligatorios, opciones agotadas deshabilitadas/opacas. Eventos `product_view` y `add_to_cart`.
- Frontend — CartSheet/CartButton: bottom sheet (`Sheet` side="bottom") con lista de items, controles de cantidad, eliminar item, subtotal y botón a checkout. Botón flotante FAB con badge de conteo.
- Frontend — CheckoutModal: formulario con `react-hook-form` + `zodResolver`. Modalidad Mesa/Recojo/Delivery con campos condicionales (mesa, dirección, zona de delivery). Selector de método de pago, resumen de orden con subtotal/delivery/total. Evento `order_started`.
- Frontend — WhatsApp: `generateWhatsAppMessage()` genera mensaje estructurado con emoji, lista de productos, modificadores, totales y datos del cliente. `createOrderLead()` llama al backend antes de redirigir a `wa.me`. Evento `whatsapp_click`.
- Frontend — Analytics: `trackEvent()` helper con PostHog. Eventos implementados: `page_view` (en carga de página pública), `product_view`, `add_to_cart`, `order_started`, `whatsapp_click`.
- Builds y lint pasan en ambos proyectos.

### 2026-05-03 (Sprint 5 — QR, Onboarding y Pulido)
- QR: nueva página `/dashboard/qr` con `QrGenerator` usando `qrcode.react`. Soporta descarga PNG (via canvas blob) y SVG (via XMLSerializer). Logo del negocio centrado en el QR. Integrado en sidebar del dashboard.
- Onboarding: flujo guiado de 6 pasos en `/dashboard/onboarding`. Shell con barra de progreso (`Progress` de shadcn). Steps: 1) Crear negocio, 2) Horarios, 3) Categoría, 4) Producto, 5) WhatsApp/publicación, 6) QR/link final. Estado persistido en `localStorage` (`mesa-onboarding`). Redirección automática al onboarding si el usuario no tiene negocios.
- Launch Checklist: componente `LaunchChecklist` en dashboard home. Valida 6 items contra datos reales del negocio activo (categorías, productos, horarios, WhatsApp, publicado). Barra de progreso visual, botón "Completar paso X" con navegación directa. Auto-oculta al 100% con mensaje de éxito.
- Modo cerrado: `ClosedOverlay` refactorizado a overlay de pantalla completa con backdrop blur. Muestra próxima apertura, horarios semanales (Accordion de base-ui), botón "Ver menú igual" que persiste en `sessionStorage`. Banner sticky bottom cuando está dismissado. Bloqueo de órdenes: botón WhatsApp oculto en Hero, carrito FAB oculto, botón "Agregar al carrito" deshabilitado con mensaje "Cerrado — No disponible".
- Productos agotados: `ProductCard` con `opacity-50`, `cursor-not-allowed`, badge "Agotado" superpuesto en imagen. Deshabilitado clic cuando `!isAvailable` o `!isOpenNow`. Hover effects suaves (`hover:-translate-y-0.5`) para productos disponibles.
- Skeletons: `PublicPageSkeleton`, `ProductListSkeleton`, `DashboardStatsSkeleton`. Página pública envuelta en `Suspense` con `PublicPageWrapper` que usa `React.use()` para streaming.
- UX Pulido: transiciones `animate-in fade-in slide-in-from-right` en steps del onboarding. Toasts de éxito/error en todos los pasos y descargas de QR. Estados de loading en botones con spinners. Botón FAB de carrito oculto cuando cerrado.
- Instalados componentes shadcn: `progress`, `accordion` (base-ui).
- Builds y lint pasan en ambos proyectos.

### 2026-05-04 (Sprint 6 — Analytics y Preparación para el Mercado)
- **Backend Analytics**: Nuevo `AnalyticsModule` con ingestion `POST /analytics/events` (persiste en `AnalyticsEvent` de PostgreSQL) y endpoints agregados: `GET /analytics/businesses/:id/summary`, `/top-products`, `/hourly`, `/daily`. Queries optimizadas con Prisma groupBy y filtros de fecha en timezone `America/Lima`.
- **OrderLeads extendido**: Nuevo endpoint autenticado `GET /businesses/:id/order-leads` con filtros por status y paginación.
- **FeatureFlagsService**: Lógica centralizada que lee `business.plan` y devuelve flags booleanos + conteos restantes. Endpoint `GET /businesses/:id/feature-flags` protegido con `TenantGuard`.
- **Plan limits fix**: `PlanLimitsService.checkModifierLimit()` agregado y aplicado en `ModifierService.createGroup()`. `MenuItemService.duplicate()` ahora también valida `checkProductLimit()`.
- **Seed script** (`prisma/seed.ts`): 5 negocios demo ficticios inspirados en Lima (La Lucha, Puku Puku, Tanta, Don Mamino, Café del Centro). Cada uno con categorías, productos reales, horarios, métodos de pago, zonas de delivery. ~120 `AnalyticsEvent` y ~15 `OrderLead` de prueba por negocio. Script idempotente.
- **Frontend Analytics**: Nuevos hooks `useAnalyticsSummary`, `useTopProducts`, `useHourlyVisits`, `useDailyVisits`, `useOrderLeads`. Nueva página `/dashboard/analytics` con stat cards, `AreaChart` de visitas diarias, `BarChart` de horas pico, top 10 productos vistos/en carrito, y tabla de últimos order leads.
- **Dashboard home actualizado**: Stat cards de "Visitas hoy", "Clics WhatsApp" y "Pedidos iniciados" ahora consultan datos reales del API. Link "Ver analytics completos" agregado.
- **Landing comercial** (`/`): Reemplazo completo del placeholder de Next.js. Diseño profesional food-centric con paleta cálida `#FFFCF8` y naranja `#f97316`. Secciones: Hero (con mockup de teléfono), Features (4 cards), Precios (Free S/0, Starter S/29, Pro S/79), FAQ (Accordion), Footer. Metadata completa (OG, Twitter Cards).
- **Marca de agua Free**: Footer discreto "Carta digital creada con Mesa.pe" en páginas públicas de negocios con `plan === 'FREE'`.
- **Badges de plan en sidebar**: Badge visual del plan actual junto al selector de negocio. Mini CTA "Upgrade →" para planes Free.
- **Tracking dual**: `trackEvent()` ahora envía eventos a PostHog Y al backend vía `fetch` fire-and-forget. Session ID persistido en `sessionStorage`.
- Builds y lint pasan en ambos proyectos.

### 2026-05-04 (Post-MVP — Sistema de Promociones)
- **Schema Prisma**: Agregados `ctaUrl`, `buttonText`, `createdAt` y `updatedAt` al modelo `Promotion`. Sincronizado en Neon PostgreSQL.
- **Backend**: Nuevo `PromotionsModule` (Controller, Service, DTOs). Endpoints CRUD bajo `GET|POST|PATCH|DELETE /businesses/:id/promotions` protegidos con `ClerkAuthGuard` + `TenantGuard`. Validación de límites de plan: Free=1, Starter=3, Pro=999.
- **PlanLimitsService** y **FeatureFlagsService**: Agregados `promotions` a los límites y flags (`canCreatePromotion`, `promotionsRemaining`).
- **Shared types**: Nuevo `promotion.schema.ts` exportado desde `@mesa/shared-types` con Zod schemas `createPromotionSchema` y `updatePromotionSchema`.
- **Dashboard admin**: Nueva página `/dashboard/promotions` con lista de promociones, modal de crear/editar (título, descripción, imagen, CTA, fechas, activo/inactivo). Hooks `usePromotions`, `useCreatePromotion`, `useUpdatePromotion`, `useDeletePromotion`. Integrado en sidebar.
- **Página pública**: `PromotionBanner` mejorado con carrusel CSS scroll-snap, navegación con flechas, dots indicadores, fechas de vigencia visibles, y CTA funcional (`ctaUrl` con `buttonText` personalizable).
- **Landing page**: Feature "Promociones y banners" agregada a la sección Features. Tabla de precios actualizada con límites de promociones por plan.
- **Seed**: 8 promociones demo agregadas a los 5 negocios ficticios.
- **Fixes de lint**: Arreglados errores preexistentes de `react-hooks/rules-of-hooks` y `react-hooks/set-state-in-effect` en `closed-overlay.tsx` y `use-onboarding.ts`.
- Builds y lint pasan en ambos proyectos.

### 2026-05-05 (Post-MVP — Plantillas Visuales / Temas)
- **Schema Prisma**: Agregado campo `theme Json?` al modelo `Business`. Sincronizado en Neon PostgreSQL con `prisma db push`.
- **Shared types**: Nuevo `theme.schema.ts` con `businessThemeSchema`, `themePresetSchema`, `fontFamilySchema`. Exportado desde `@mesa/shared-types`. Actualizado `business.schema.ts` para incluir `theme` opcional en `createBusinessSchema` y `updateBusinessSchema`.
- **Backend**: Actualizado `CreateBusinessDto` / `UpdateBusinessDto` con `BusinessThemeDto`. `BusinessService.create()` ahora asigna un tema default (`terracotta`) si no se envía uno. `BusinessService.update()` castea `theme` a `Prisma.InputJsonValue`. `findPublicBySlug` ahora devuelve `theme` en el payload público.
- **Frontend — Sistema de temas**: Nuevo `lib/theme.ts` con helpers de color (hexToRgb, mixColors, isDarkColor), `generateThemeVariables()` que produce 12 variables CSS derivadas, y 4 paletas predefinidas (`terracotta`, `ocean`, `forest`, `midnight`).
- **Frontend — Refactor CSS Variables**: Todos los componentes públicos (`hero-section`, `product-card`, `category-nav`, `product-list`, `promotion-banner`, `business-info`, `cart-button`, `cart-sheet`, `product-modal`, `checkout-modal`, `closed-overlay`, `open-status-badge`, `photo-gallery`, `floating-whatsapp`) refactorizados para usar variables CSS (`--theme-primary`, `--theme-bg`, `--theme-text`, `--theme-accent`, etc.) en lugar de hex codes hardcodeados.
- **Frontend — Layout público**: `layout.tsx` limpiado de colores hardcodeados. `public-page-wrapper.tsx` y `public-page-client.tsx` ahora inyectan las variables CSS del tema activo via inline `style`. El tipo `PublicBusiness` incluye `theme`.
- **Dashboard — Página de Diseño**: Nueva ruta `/dashboard/design` con selector de 4 temas predefinidos (cards con preview visual), sección de colores personalizados (4 color pickers con inputs hex), selector de tipografía (Sans/Serif/Mono), preview en vivo con mockup de la carta, y botón "Guardar cambios" conectado a `useUpdateBusiness`. Usa patrón `DesignEditor` con `key={business.id}` para evitar `setState` en effects.
- **Dashboard — Sidebar**: Agregado item "Diseño" con icono `Palette` entre "Promociones" y "Código QR".
- **Landing page**: Nueva feature "Diseño que te representa" agregada a la sección Features (ícono `Palette`, descripción de temas predefinidos y personalización). Tabla de precios actualizada con "Temas visuales" en Free, "Temas visuales personalizados" en Starter y Pro.
- **Preview fiel**: Nuevo componente `ThemePreview` que replica la estructura real de la carta pública (hero, promo, search, categorías, productos, info, footer) con CSS variables dinámicas. Reemplaza el mockup básico en `/dashboard/design`.
- **Builds y lint**: Builds pasan en `web` y `api`. Lint sin errores nuevos (solo warnings preexistentes de otras páginas).

### 2026-05-05 (Post-MVP — Exportar QR en PDF + Tour Interactivo)
- **Dependencias**: Instaladas `jspdf`, `html2canvas` y `react-joyride` en `apps/web`.
- **Export QR en PDF**: Nuevo helper `lib/pdf-export.ts` que genera un PDF tipo "Colócalo en tu mesa" (A4) con diseño profesional: nombre del negocio, QR grande centrado, logo overlay, instrucciones para el cliente, hint de WhatsApp y footer de mesa.pe. Usa `html2canvas` para capturar un layout off-screen y `jspdf` para generar el PDF.
- **QrGenerator**: Agregado botón "PDF" junto a PNG/SVG. El contenedor del QR ahora tiene `data-qr-slug` para que el PDF helper capture el QR existente del DOM.
- **Tour interactivo del dashboard**: Nuevo componente `components/dashboard/dashboard-tour.tsx` usando `react-joyride` (cargado vía `next/dynamic` con `ssr: false`). Tour de 7 pasos guiados: Mi Negocio → Productos → Diseño → Código QR → Analytics → Selector de negocio → ¡Empieza a vender!. Estilos custom con paleta Mesa.pe (terracotta, cream, coffee).
- **Persistencia del tour**: Nuevo hook `hooks/use-dashboard-tour.ts` con `useSyncExternalStore` (React 19 compliant, evita `setState` en effects). Guarda `hasSeenTour` y `lastStepIndex` en `localStorage` bajo la key `mesa-dashboard-tour`.
- **Reiniciar tour**: Botón en Configuración → General para limpiar el estado del tour y volver a verlo.
- **TODO.md**: Marcadas como completadas las tareas "Exportar QR en PDF" y "Mejor onboarding con tooltips".
- **Builds y lint**: Builds pasan en `web` y `api`. Lint sin errores nuevos.

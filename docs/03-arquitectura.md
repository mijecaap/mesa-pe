# Mesa.pe — Arquitectura de Sistemas

## 1. Vista General

```
[Cliente final móvil]
        |
        v
[Next.js Public Storefront]  <--->  [Next.js Dashboard Admin]
        |                                   |
        | eventos públicos                  | API autenticada
        v                                   v
[NestJS API] ----------------------> [PostgreSQL (Neon)]
   |   |                                   |
   |   |                                   +-- negocios, menús, productos, pedidos, eventos
   |   |
   |   +---- [Redis/BullMQ] jobs: analytics, imágenes, emails futuros
   |
   +---- [Cloudflare R2] logos, fotos, banners, QR
```

## 2. Separación de Aplicaciones (Monorepo)

```
mesa-pe/
├── apps/
│   ├── web/        # Next.js: Dashboard + Página pública + Landing
│   └── api/        # NestJS API REST
├── packages/
│   ├── shared-types/  # Tipos y schemas Zod compartidos
│   ├── ui/            # Componentes shadcn/ui compartidos
│   └── config/        # tsconfig, eslint, prettier compartidos
```

## 3. Flujo Público Principal

1. Cliente escanea QR o abre link de Instagram/Google.
2. Ve página pública del negocio (`/{slug}`).
3. Revisa categorías y productos.
4. Agrega productos al carrito (persistencia localStorage).
5. Selecciona modalidad: consumo en local, recojo o delivery.
6. Ingresa datos mínimos y notas.
7. Clic en "Enviar pedido por WhatsApp".
8. Sistema registra `OrderLead` y evento `order_started`.
9. Se abre WhatsApp con mensaje estructurado.
10. El restaurante confirma manualmente.

## 4. Flujo Administrador Principal

1. Dueño crea cuenta (Clerk).
2. Crea negocio y configura datos básicos.
3. Crea categorías y productos con fotos y precios.
4. Configura horarios, métodos de pago y zonas de delivery.
5. Descarga QR y copia link público.
6. Revisa analítica básica en dashboard.

## 5. Enfoque Multi-tenant

Todas las entidades privadas están asociadas a `businessId`.

**Regla crítica:**

> Ningún endpoint privado debe consultar o modificar datos sin validar que el usuario pertenece al negocio.

Implementación:

- Clerk maneja organizaciones (cada negocio es una organización).
- El backend valida el JWT de Clerk y extrae `orgId`.
- Todos los endpoints privados requieren `businessId` y validan pertenencia.

## 6. Seguridad

- Autenticación segura via Clerk (OAuth, email, etc.).
- Rate limiting en APIs públicas.
- Validación de tenant en todos los endpoints privados.
- Sanitización de inputs visibles públicamente.
- Uploads con validación de tipo y tamaño.
- URLs firmadas para carga de imágenes a R2.
- Protección contra edición cruzada entre negocios.

## 7. Performance y SEO

- Página pública con Lighthouse Performance objetivo: **85+ en móvil**.
- Imágenes optimizadas con `next/image`.
- TTFB bajo en páginas públicas cacheables.
- Carga inicial pública menor a **2.5 segundos** en red móvil.
- SEO: título único, meta description, Open Graph, Schema.org `Restaurant` / `LocalBusiness`.
- Sitemap para páginas públicas activas.

## 8. Disponibilidad

- Objetivo MVP: 99% mensual.
- El sitio público debe degradar de forma segura si falla analítica.
- El menú público debe funcionar aunque módulos secundarios fallen.

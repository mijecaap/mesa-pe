# Mesa.pe

SaaS para carta digital, QR y pedidos por WhatsApp para cafeterías, dark kitchens y restaurantes pequeños en Perú.

> **Promesa:** _"Tu carta, web, QR y pedidos por WhatsApp listos para vender en menos de 30 minutos."_

## Stack Técnico

- **Frontend:** Next.js 16 + React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** NestJS + TypeScript
- **Base de datos:** PostgreSQL (Neon) + Prisma ORM
- **Auth:** Clerk
- **Cache/Jobs:** Redis + BullMQ
- **Storage:** Cloudflare R2
- **Deploy:** Vercel (web) + Railway (API)

## Estructura del Proyecto

```
mesa-pe/
├── apps/
│   ├── web/          # Next.js (Dashboard + Página pública)
│   └── api/          # NestJS API REST
├── packages/
│   ├── shared-types/ # Tipos y enums compartidos
│   └── config/       # Configuraciones TS compartidas
├── docs/             # Documentación de estrategia
└── package.json      # Root del monorepo (pnpm workspaces)
```

## Scripts

```bash
# Instalar dependencias
pnpm install

# Desarrollo (todos los proyectos)
pnpm dev

# Build (todos los proyectos)
pnpm build

# Web solo
pnpm --filter web dev

# API solo
pnpm --filter api start:dev
```

## Variables de Entorno

### apps/web

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### apps/api

```env
DATABASE_URL=postgresql://...
PORT=4000
CLERK_SECRET_KEY=...
REDIS_URL=redis://...
```

## Documentación

Ver la carpeta `docs/` para la estrategia completa:

- `01-introduccion.md` — Visión y objetivos
- `02-stack-tecnico.md` — Stack detallado
- `03-arquitectura.md` — Arquitectura de sistemas
- `04-modelo-datos.md` — Modelo Prisma
- `05-plan-sprints.md` — Plan de 6 sprints
- `06-roadmap.md` — Roadmap post-MVP
- `07-go-to-market.md` — Estrategia de salida al mercado
- `08-decisiones-tecnicas.md` — Decisiones técnicas
- `TODO.md` — Control de progreso

## Estado Actual

- [x] Monorepo inicializado
- [x] Next.js configurado con Tailwind y dependencias
- [x] NestJS configurado con Prisma y Swagger
- [x] Schema de base de datos creado
- [x] Builds funcionando
- [ ] Auth (Clerk) — pendiente
- [ ] CRUD de negocio y menú — pendiente

## Autor

Miguel Castro

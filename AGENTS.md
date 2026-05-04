# Mesa.pe — Agent Notes

Compact reference for working in this monorepo. Omitting the obvious.

## Monorepo Mechanics

- **Package manager:** pnpm 9.0.0 (enforced via `packageManager` field).
- **Task runner:** Turbo. Pipeline in `turbo.json`.
  - `lint` depends on `^build` — if caches are stale, build first.
  - `dev` is `persistent: true` and `cache: false`.
- **Filter syntax:** `pnpm --filter web <cmd>` or `pnpm --filter api <cmd>`.

## Common Commands

```bash
# Install everything
pnpm install

# Dev all apps in parallel
pnpm dev

# Build / lint everything
pnpm build
pnpm lint

# Format (Prettier, root-level)
pnpm format

# Web only
pnpm --filter web dev

# API only
pnpm --filter api start:dev
```

## App Boundaries & Entrypoints

| App/Package             | Role                                                      | Key Entrypoint                                    |
| ----------------------- | --------------------------------------------------------- | ------------------------------------------------- |
| `apps/web`              | Next.js 16 dashboard + public page                        | `src/app/layout.tsx`, `src/app/page.tsx`          |
| `apps/api`              | NestJS REST API                                           | `src/main.ts` (bootstraps Swagger at `/api/docs`) |
| `packages/shared-types` | Zod schemas + shared TS types                             | `src/index.ts`                                    |
| `packages/config`       | Shared TS configs (`tsconfig.json`, `tsconfig.nest.json`) | —                                                 |

## Next.js 16 + React 19 Warning

**This is NOT the Next.js from training data.** Next.js 16 and React 19 have breaking changes in APIs, conventions, and file structure. Before writing any web code, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices.

## NestJS + Prisma Workflow

Prisma schema lives at `apps/api/prisma/schema.prisma`.

```bash
# After schema changes
pnpm --filter api db:generate   # Generate Prisma Client
pnpm --filter api db:migrate    # Run migrations

# Utility
pnpm --filter api db:studio     # Open Prisma Studio
pnpm --filter api db:seed       # Run seed script
```

- The API uses `@nestjs/config` with `isGlobal: true`.
- Env file is `apps/api/.env` (not committed; see `.gitignore`).
- Swagger docs are served at `http://localhost:4000/api/docs`.

## Shared Types

- Package name: `@mesa/shared-types`.
- **Web transpiles it:** `next.config.ts` sets `transpilePackages: ["@mesa/shared-types"]`.
- API consumes it directly via `workspace:*`.

## Environment Requirements

### apps/web

Needs `NEXT_PUBLIC_API_URL=http://localhost:4000` (or production equivalent).

### apps/api

Required vars in `apps/api/.env`:

- `DATABASE_URL` (PostgreSQL)
- `PORT` (defaults to 4000)
- `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`
- `REDIS_URL`
- `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` (Cloudflare R2)

## Lint & Typecheck

- **Web:** ESLint uses `eslint-config-next` flat config (`eslint.config.mjs`).
- **API:** ESLint uses `typescript-eslint` + Prettier (`eslint.config.mjs`), with `endOfLine: "auto"`.
- **API TSConfig:** `module: "nodenext"`, `moduleResolution: "nodenext"`, decorators enabled.
- **Web TSConfig:** `moduleResolution: "bundler"`, `jsx: "react-jsx"`.

## Testing

- API unit tests: `pnpm --filter api test` (Jest, ts-jest, `*.spec.ts` in `src/`).
- API e2e tests: `pnpm --filter api test:e2e` (config at `test/jest-e2e.json`).
- Web has no test runner configured yet.

## Docs & Strategy

Business/docs live in `/docs/` (markdown). Not code docs.

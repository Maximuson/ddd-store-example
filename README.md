# DDD Store Example

Educational monorepo demonstrating **Domain Driven Design**, **Clean Architecture**, **multi-framework web clients**, and **offline-first mobile** patterns.

## Prerequisites

- **Node.js** 24.18.0 (see `.nvmrc`)
- **TypeScript** 6.x (workspace root devDependency)

## Quick Start

```bash
# Install dependencies
npm install

# Copy env examples for each web app (required before first run)
cp apps/web/react/.env.example apps/web/react/.env
cp apps/web/vue/.env.example apps/web/vue/.env
cp apps/web/angular/.env.example apps/web/angular/.env
cp apps/web/astro/.env.example apps/web/astro/.env

# Start web apps (mock mode by default — no API required)
npm run dev:web              # React (port 5173)
npm run dev:web:react        # React (port 5173)
npm run dev:web:vue          # Vue (port 5174)
npm run dev:web:angular      # Angular (port 5175)
npm run dev:web:astro        # Astro (port 4321)

# Start API (port 3000)
npm run dev:api

# Start mobile app
npm run dev:mobile
```

Environment files live in each app folder. Web apps use `apps/web/<framework>/.env` (copy from `.env.example` in the same folder). API and mobile: see the root [`.env.example`](.env.example).

## Mock Mode

Web apps default to **mock mode** (`VITE_USE_MOCK=true` in each `.env` file). They use in-memory repositories from `packages/*` and do not require the API.

To connect a web app to the real backend, set in `apps/web/<framework>/.env`:

```bash
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:3000
```

Then start the API with `npm run dev:api`.

Mobile supports the same pattern via `EXPO_PUBLIC_USE_MOCK` in `apps/mobile/.env` (see root `.env.example`).

## Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@demo.com | password123 | ADMIN |
| user@demo.com | password123 | USER |

## Project Structure

```
ddd-store-example/
├── apps/
│   ├── api/                 NestJS REST API + Prisma (port 3000)
│   ├── mobile/              Expo + SQLite offline-first
│   └── web/
│       ├── shared/          @ddd-store/web-shared — routes, store logic, prop specs
│       ├── react/           @ddd-store/web-react   — React 19 + Vite (5173)
│       ├── vue/             @ddd-store/web-vue      — Vue 3.5 + Vite (5174)
│       ├── angular/         @ddd-store/web-angular  — Angular 22 (5175)
│       └── astro/           @ddd-store/web-astro   — Astro 7 + Vue islands (4321)
├── packages/
│   ├── shared/              Cross-cutting domain primitives
│   ├── auth/                Authentication bounded context
│   ├── users/               Users & sessions
│   └── catalog/             Product catalog
└── docs/                    Architecture documentation
```

### Web layer (multi-framework)

The browser layer uses **Variant B** architecture:

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Shared slices | `apps/web/shared` | Route metadata (`pages/`), xstate-store logic (`logic/`), TypeScript prop contracts (`spec/`), Tailwind theme tokens |
| Framework UI | `apps/web/{react,vue,angular,astro}` | Components, routing, dependency injection |
| Domain logic | `packages/*` | Framework-free bounded contexts (domain → application → infrastructure) |

Feature slices in `apps/web/shared`: `shell`, `auth`, `catalog`, `users`, `admin`.

- **React / Vue / Angular** — full SPA with auth, catalog, profile, and admin flows
- **Astro** — static pages with Vue islands for catalog and product detail (mock data)

See [apps/web/README.md](apps/web/README.md) for web-specific commands and conventions.

## Learning Path

1. Read [docs/01-project-overview.md](docs/01-project-overview.md)
2. Read [docs/03-dependency-rules.md](docs/03-dependency-rules.md)
3. Explore `packages/catalog/src/domain/` — pure business entities
4. Explore `packages/catalog/src/application/use-cases/` — business workflows
5. Explore `apps/web/shared/catalog/` — shared route metadata and store logic
6. Explore `apps/web/react/src/di/container.ts` — dependency injection (mock vs HTTP)
7. Compare the same catalog feature across `apps/web/react`, `apps/web/vue`, and `apps/web/angular`
8. Read [ARCHITECTURE.md](ARCHITECTURE.md) for the full picture

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev:api` | Start NestJS API (port 3000) |
| `npm run dev:web` | Start React app (alias for `dev:web:react`, port 5173) |
| `npm run dev:web:react` | Start React + Vite dev server |
| `npm run dev:web:vue` | Start Vue + Vite dev server |
| `npm run dev:web:angular` | Start Angular dev server |
| `npm run dev:web:astro` | Start Astro dev server |
| `npm run dev:mobile` | Start Expo |
| `npm run dev:mobile:ios` | Start Expo iOS simulator |
| `npm run build` | Build all workspace packages |
| `npm run test` | Run all tests |
| `npm run lint` | Lint all packages |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed demo users and products |

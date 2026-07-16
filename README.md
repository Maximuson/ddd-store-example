# DDD Store Example

Educational monorepo demonstrating **Domain Driven Design**, **Clean Architecture**, and **offline-first mobile** patterns.

## Quick Start

```bash
# Install dependencies
npm install

# Start web app (port 5173) — mock mode by default
npm run dev:web

# Start API (port 3000)
npm run dev:api

# Start mobile app
npm run dev:mobile
```

Environment files are in each app folder: `apps/api/.env`, `apps/web/.env`, `apps/mobile/.env`.
See `.env.example` for reference.

## Mock Mode

Web and mobile support running without the backend:

```bash
# Web — uses in-memory mock repositories
VITE_USE_MOCK=true npm run dev:web

# Mobile
EXPO_PUBLIC_USE_MOCK=true npm run dev:mobile
```

## Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@demo.com | password123 | ADMIN |
| user@demo.com | password123 | USER |

## Project Structure

```
apps/
  api/      NestJS REST API
  web/      React + Vite + xstate-store
  mobile/   Expo + SQLite offline-first
packages/
  shared/   Cross-cutting domain primitives
  auth/     Authentication bounded context
  users/    Users & sessions
  catalog/  Product catalog
docs/       Architecture documentation
```

## Learning Path

1. Read [docs/01-project-overview.md](docs/01-project-overview.md)
2. Read [docs/03-dependency-rules.md](docs/03-dependency-rules.md)
3. Explore `packages/catalog/src/domain/` — pure business entities
4. Explore `packages/catalog/src/application/use-cases/` — business workflows
5. Explore `apps/web/src/di/container.ts` — dependency injection
6. Read [ARCHITECTURE.md](ARCHITECTURE.md) for the full picture

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev:api` | Start NestJS API |
| `npm run dev:web` | Start Vite dev server |
| `npm run dev:mobile` | Start Expo |
| `npm run build` | Build all packages |
| `npm run test` | Run all tests |
| `npm run lint` | Lint all packages |

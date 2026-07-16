# Project Overview

## Purpose

This repository is an **educational MVP** demonstrating practical implementation of:

- **Domain Driven Design (DDD)** — bounded contexts, entities, value objects, ubiquitous language
- **Clean Architecture** — dependency inversion, layer separation
- **Vertical Slice / Feature Module Architecture** — features organized by business capability
- **Monorepo** — shared business logic across web, mobile, and API
- **Offline-first mobile** — SQLite cache with sync
- **Repository pattern** — abstract data access behind interfaces
- **Application services / use cases** — orchestrate business workflows

The code is written for clarity and learning value, not minimal line count.

## Bounded Contexts

| Context | Package | Responsibility |
|---------|---------|----------------|
| **Shared Kernel** | `packages/shared` | Cross-cutting value objects, errors, Session entity |
| **Authentication** | `packages/auth` | Login, logout, token management |
| **Users** | `packages/users` | User profiles, session listing, session termination |
| **Catalog** | `packages/catalog` | Product browsing and admin CRUD |

## Applications

| App | Stack | Role |
|-----|-------|------|
| `apps/web` | React, Vite, TypeScript, xstate-store, Tailwind | Browser client with mock/API toggle |
| `apps/mobile` | Expo, React Native, NativeWind, SQLite | Offline-first mobile client |
| `apps/api` | NestJS, Prisma, SQLite (dev) | REST API with JWT auth |

## Tech Stack Decisions

- **npm workspaces** — monorepo package management
- **TypeScript strict mode** — catch errors at compile time
- **xstate-store (web)** — dumb UI stores (data, loading, error); hooks invoke use cases
- **Prisma + SQLite** — simple local dev; schema is PostgreSQL-compatible for production
- **Tailwind + NativeWind** — consistent utility-first styling

## Learning Goals

After exploring this repo, a Middle Frontend Developer should understand:

1. Why repository interfaces live in the **domain** layer
2. How **use cases** coordinate domain objects without knowing about HTTP or React
3. How **dependency injection** swaps Mock vs Http vs Sqlite implementations
4. How **xstate-store + hooks** hold UI state while use cases handle business logic
5. How **offline-first** mobile reads from SQLite whether online or offline

## Demo Credentials (after seed)

| Email | Password | Role |
|-------|----------|------|
| admin@demo.com | password123 | ADMIN |
| user@demo.com | password123 | USER |

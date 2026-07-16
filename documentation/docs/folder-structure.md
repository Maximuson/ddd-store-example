---
sidebar_position: 3
---

# Folder Structure

Annotated directory tree for the monorepo. Every major folder contains a `README.md` explaining its purpose.

```
ddd-store-example/
├── README.md                # Setup instructions and learning guide
├── documentation/           # Docusaurus documentation site
│   └── docs/                # Architecture documentation (this site)
├── apps/
│   ├── api/                 # NestJS REST API
│   ├── web/                 # Multi-framework browser apps (react, vue, angular, astro, shared)
│   └── mobile/              # Expo React Native app
└── packages/
    ├── shared/              # Cross-cutting domain primitives
    ├── auth/                # Authentication bounded context
    ├── users/               # Users & sessions bounded context
    └── catalog/             # Product catalog bounded context
```

## Package Internal Structure

Each business package (`auth`, `users`, `catalog`) follows Clean Architecture:

```
packages/<context>/
├── README.md
└── src/
    ├── domain/              # Pure business rules — NO frameworks
    │   ├── entities/
    │   ├── value-objects/
    │   ├── repositories/    # Interfaces only
    │   └── services/
    ├── application/         # Use cases — orchestrates domain
    │   ├── use-cases/
    │   └── dto/
    ├── infrastructure/      # Technical implementations
    │   ├── api/             # HTTP repositories
    │   ├── database/        # SQLite repositories (mobile)
    │   ├── mocks/           # In-memory repositories (dev/mock mode)
    │   └── mappers/         # DTO ↔ Entity mapping
    └── presentation/        # Legacy folder; web UI moved to apps/web/shared + framework apps
```

## API Module Structure

```
apps/api/src/modules/<module>/
├── domain/
├── application/
├── infrastructure/          # Prisma repositories
└── presentation/            # NestJS controllers & request DTOs
```

## Web App Structure

```
apps/web/
├── shared/                  # @ddd-store/web-shared vertical slices
│   ├── styles/theme.css
│   ├── shell/               # PageDefinition, route guards
│   ├── auth/                # pages, logic, spec
│   ├── catalog/
│   ├── users/
│   └── admin/
├── react/src/features/      # React UI per slice
├── vue/src/features/        # Vue UI per slice
├── angular/src/app/features/
└── astro/src/pages/         # Static pages + Vue islands
```

Each runnable web app has:

```
apps/web/<framework>/src/
├── app/ or router/          # Shell, routing, auth
├── di/                      # DI container (composition root)
└── features/<slice>/        # Framework-native UI implementing shared spec
```

## Mobile App Structure

```
apps/mobile/src/
├── app/                     # Expo Router screens
├── di/                      # DI container (SQLite repos)
├── db/                      # SQLite setup, migrations, sync
└── features/                # Mobile-specific feature glue
```

## Why This Structure?

- **Packages are reusable** — same `LoginUserUseCase` runs in web, mobile, and is mirrored server-side
- **Layers enforce dependency direction** — domain never imports infrastructure
- **Vertical slices in apps/** — each app composes packages for its platform without duplicating business logic
- **README per layer** — self-documenting for learners

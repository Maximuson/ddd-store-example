# Folder Structure

Annotated directory tree for the monorepo. Every major folder contains a `README.md` explaining its purpose.

```
ddd-store-example/
├── ARCHITECTURE.md          # Final consolidated architecture reference (written last)
├── README.md                # Setup instructions and learning guide
├── docs/                    # Pre-implementation architecture documentation
├── apps/
│   ├── api/                 # NestJS REST API
│   ├── web/                 # React + Vite browser app
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
    └── presentation/        # UI-specific code (shared across web/mobile where possible)
        ├── components/
        ├── hooks/             # Call use cases, update stores
        └── stores/            # xstate-store (data, loading, error only)
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
apps/web/src/
├── app/                     # App shell, router, providers
├── di/                      # Dependency injection container
├── features/                # Vertical slices (thin page-level glue)
└── pages/                   # Route page components
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

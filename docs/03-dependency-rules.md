# Dependency Rules

## The Dependency Rule (Clean Architecture)

> Source code dependencies must point **inward**. Inner layers know nothing about outer layers.

```
Presentation  →  Application  →  Domain
Infrastructure  →  Domain (implements interfaces defined here)
```

## Layer Responsibilities

### Domain Layer (`domain/`)

**Contains:** Entities, value objects, domain services, repository **interfaces**

**Must NOT contain:** React, NestJS, Prisma, HTTP, SQLite, XState, axios, fetch

**Example:**
```typescript
// packages/catalog/src/domain/repositories/ProductRepository.ts
export interface ProductRepository {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
}
```

### Application Layer (`application/`)

**Contains:** Use cases, application DTOs

**Depends on:** Domain only

**Must NOT contain:** UI code, database queries, HTTP calls

**Example:**
```typescript
// packages/catalog/src/application/use-cases/GetProductsUseCase.ts
export class GetProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.getProducts();
  }
}
```

### Infrastructure Layer (`infrastructure/`)

**Contains:** HTTP repos, SQLite repos, mock repos, mappers

**Implements:** Domain repository interfaces

**Example:**
```typescript
// packages/catalog/src/infrastructure/api/HttpProductRepository.ts
export class HttpProductRepository implements ProductRepository {
  constructor(private readonly apiClient: ApiClient) {}
  async getProducts(): Promise<Product[]> { /* fetch + map */ }
}
```

### Presentation Layer (`presentation/`)

**Contains:** React components, xstate-store stores, hooks

**Depends on:** Application (use cases) + Domain (types)

**Must NOT:** Call HTTP directly or contain business validation logic

## App-Level Composition (`apps/*/src/di/`)

Apps wire dependencies at the composition root:

```typescript
const useMock = import.meta.env.VITE_USE_MOCK === 'true';
const productRepository = useMock
  ? new MockProductRepository()
  : new HttpProductRepository(apiClient);

export const getProductsUseCase = new GetProductsUseCase(productRepository);
```

The application layer never knows which implementation is injected.

## ESLint Boundary Enforcement

`eslint-plugin-boundaries` rules (configured in root `.eslintrc.cjs`):

| From | Can import |
|------|-----------|
| `domain` | `domain` only |
| `application` | `domain`, `application` |
| `infrastructure` | `domain`, `application`, `infrastructure` |
| `presentation` | `domain`, `application`, `presentation` |
| `apps` | anything (composition root) |

## Common Mistakes

1. **Putting axios in a use case** — use cases call repository interfaces, not HTTP
2. **Importing MockRepository in presentation** — wire via DI container in `apps/`
3. **Business validation in a hook** — hooks orchestrate use cases; use cases validate
4. **Domain entity with `@Column()` decorator** — keep ORM annotations in infrastructure mappers
5. **Circular imports between packages** — `shared` is the only shared kernel; contexts don't import each other

## DDD Mapping

| DDD Concept | Location |
|-------------|----------|
| Entity | `domain/entities/` |
| Value Object | `domain/value-objects/` |
| Repository (interface) | `domain/repositories/` |
| Domain Service | `domain/services/` |
| Application Service | `application/use-cases/` |
| Anti-Corruption Layer | `infrastructure/mappers/` |
| Bounded Context | `packages/<context>/` |

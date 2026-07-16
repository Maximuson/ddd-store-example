# Application Layer — ucatalog

## Purpose

The application layer contains **business workflows** (use cases). It orchestrates domain objects to fulfill user scenarios.

## What belongs here

- **Use cases** — one class per business scenario (LoginUserUseCase, GetProductsUseCase)
- **DTOs** — input/output shapes for use case boundaries

## Dependency rules

- May import from `domain/` only (plus `@ddd-store/shared`)
- Must NOT import React, XState, HTTP clients, or database drivers
- Receives repository **interfaces** via constructor injection

## Example

```typescript
export class GetProductsUseCase {
  constructor(private readonly repo: ProductRepository) {}
  async execute(): Promise<Product[]> {
    return this.repo.getProducts();
  }
}
```

## Common mistakes

1. Calling axios/fetch directly in a use case
2. Putting UI loading state logic here
3. Returning raw API response shapes instead of domain entities

## DDD connection

Use cases are **Application Services** — they coordinate the domain model without containing business rules themselves.

# Domain Layer — uusers

## Purpose

The domain layer contains **enterprise business rules**. It is the innermost layer of Clean Architecture.

## What belongs here

- **Entities** — objects with identity (User, Product, Session)
- **Value Objects** — immutable objects without identity (Email, Money, Role)
- **Repository interfaces** — contracts for data access (no implementation)
- **Domain services** — business logic that doesn't fit in a single entity

## Dependency rules

- Must NOT import React, NestJS, Prisma, axios, SQLite, or any framework
- Must NOT import from `application/`, `infrastructure/`, or app/UI code
- May import from `@ddd-store/shared` domain types

## Example

```typescript
// Repository interface — domain defines WHAT, infrastructure defines HOW
export interface ProductRepository {
  getProducts(): Promise<Product[]>;
}
```

## Common mistakes

1. Putting database queries in repository implementations here (implementations go in infrastructure)
2. Adding validation that depends on HTTP status codes
3. Importing DTOs from the API layer

## DDD connection

This layer implements the **Domain Model** in DDD terminology. Entities and value objects form the ubiquitous language of the bounded context.

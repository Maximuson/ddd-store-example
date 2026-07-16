# Infrastructure Layer — ucatalog

## Purpose

The infrastructure layer contains **technical implementations** — how data is fetched, stored, and mapped.

## What belongs here

- **HTTP repositories** — API communication (HttpProductRepository)
- **SQLite repositories** — local database (SqliteProductRepository)
- **Mock repositories** — in-memory data for development
- **Mappers** — convert between API DTOs and domain entities

## Dependency rules

- Implements interfaces defined in `domain/repositories/`
- May import from `domain/` and `application/`
- Must NOT be imported by `domain/` or `application/`

## Example

```typescript
export class HttpProductRepository implements ProductRepository {
  async getProducts(): Promise<Product[]> {
    const response = await this.client.get('/products');
    return response.data.map(mapProductDtoToEntity);
  }
}
```

## Common mistakes

1. Leaking HTTP response types into use cases
2. Putting business validation in mappers
3. Importing infrastructure from app/UI code directly (use DI container)

## DDD connection

Infrastructure is the **Anti-Corruption Layer** when mapping external API shapes to domain entities.

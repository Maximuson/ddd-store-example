# @ddd-store/shared

Bounded context package for **ushared**. See layer READMEs inside `src/` for architecture details.

## Layers

- `src/domain/` — entities, value objects, repository interfaces
- `src/application/` — use cases
- `src/infrastructure/` — HTTP, SQLite, mock implementations
- `src/store/` — shared store utilities (`createAsyncStoreLogic`)

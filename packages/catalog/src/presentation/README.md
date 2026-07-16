# Presentation Layer — catalog

## Purpose

The presentation layer contains **UI-specific code** — components, hooks, and stores.

## What belongs here

- **React components** — forms, lists, cards
- **xstate-store stores** — dumb state containers (data, loading, error only)
- **Hooks** — call use cases and update stores

## Dependency rules

- May import from `domain/` (types) and `application/` (use cases)
- Must NOT import from `infrastructure/` directly — repos are injected via app DI container
- Must NOT contain business validation logic

## Example

```typescript
// Hook calls use case, store only holds state
const fetch = useCallback(async () => {
  store.trigger.setLoading();
  try {
    const products = await getProductsUseCase.execute();
    store.trigger.setData({ data: products });
  } catch (e) {
    store.trigger.setError({ error: e.message });
  }
}, [store, getProductsUseCase]);
```

## Common mistakes

1. Putting axios calls in components or hooks without use cases
2. Duplicating business rules in form validation
3. Importing MockRepository in components
4. Putting async logic or use-case calls inside store definitions

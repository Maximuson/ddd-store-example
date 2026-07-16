# Presentation Layer — uauth

## Purpose

The presentation layer contains **UI-specific code** — components, hooks, and state machines.

## What belongs here

- **React components** — forms, lists, cards
- **XState machines** — UI state (loading, error, success) that invoke use cases
- **Hooks** — connect components to machines/use cases

## Dependency rules

- May import from `domain/` (types) and `application/` (use cases)
- Must NOT import from `infrastructure/` directly — repos are injected via app DI container
- Must NOT contain business validation logic

## Example

```typescript
// XState machine invokes use case — never calls HTTP directly
submitting: {
  invoke: {
    src: async (_, event) => loginUseCase.execute(event.credentials),
    onDone: { target: 'authenticated' },
    onError: { target: 'error' },
  },
}
```

## Common mistakes

1. Putting axios calls in components or machines
2. Duplicating business rules in form validation
3. Importing MockRepository in components

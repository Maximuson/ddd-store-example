# Presentation Layer — auth

## Purpose

The presentation layer contains **UI-specific code** — components and hooks.

## What belongs here

- **React components** — forms, lists, cards
- **Hooks** — connect components to use cases (auth state lives in app-level AuthContext)

## Dependency rules

- May import from `domain/` (types) and `application/` (use cases)
- Must NOT import from `infrastructure/` directly — repos are injected via app DI container
- Must NOT contain business validation logic

## Example

```typescript
// AuthContext calls use cases — never HTTP directly
const login = async (email: string, password: string) => {
  const result = await loginUserUseCase.execute({ email, password, ... });
  setState({ user, token: result.token.accessToken, ... });
};
```

## Common mistakes

1. Putting axios calls in components
2. Duplicating business rules in form validation
3. Importing MockRepository in components

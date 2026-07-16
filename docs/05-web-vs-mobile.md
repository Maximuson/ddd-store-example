# Web vs Mobile Differences

## Shared Code

Both platforms consume the same packages:

- `packages/shared` — Session, Role, Email, Money value objects
- `packages/auth` — LoginUserUseCase, LogoutSessionUseCase
- `packages/users` — GetUserProfileUseCase, ListActiveSessionsUseCase
- `packages/catalog` — GetProductsUseCase, GetProductByIdUseCase

Business logic is **identical**. Only infrastructure and presentation differ.

## Session Behavior

| Aspect | Web | Mobile |
|--------|-----|--------|
| Expiration | Automatic (`expiresAt` set, e.g. 24h) | No auto-expire (`expiresAt: null`) |
| Storage | JWT in memory/localStorage | JWT + refresh token in SQLite |
| Token refresh | Re-login on expiry | `POST /auth/refresh` when online |
| Device type | `WEB` | `MOBILE` |
| User agent | Browser string | `Expo/<version>` |

## Repository Implementations

| Package | Web | Mobile |
|---------|-----|--------|
| auth | `HttpAuthRepository` or `MockAuthRepository` | `HttpAuthRepository` + `SqliteAuthRepository` |
| users | `HttpUserRepository` or `MockUserRepository` | `SqliteUserRepository` (synced) |
| catalog | `HttpProductRepository` or `MockProductRepository` | `SqliteProductRepository` (synced) |

## State Management

| Platform | Approach |
|----------|----------|
| Web (all frameworks) | xstate-store logic in `@ddd-store/web-shared/<slice>/logic` + framework hooks |
| Mobile | React hooks + local component state (same use case invocation pattern) |

## UI Framework

| Platform | Styling | Routing |
|----------|---------|---------|
| Web React | Tailwind CSS v4 | React Router 7 |
| Web Vue | Tailwind CSS v4 | Vue Router 4 |
| Web Angular | Tailwind CSS v4 | Angular Router 22 |
| Web Astro | Tailwind CSS v4 | File-based routes + Vue islands |
| Mobile | NativeWind | Expo Router |

## Offline Support

| Platform | Offline |
|----------|---------|
| Web | Not supported (requires API or mock mode) |
| Mobile | Full offline via SQLite cache |

Web shows an error when API is unreachable (unless mock mode is on).
Mobile shows cached data with a stale-data banner.

## Mock Mode

| Platform | Env Variable |
|----------|-------------|
| Web | `VITE_USE_MOCK=true` |
| Mobile | `EXPO_PUBLIC_USE_MOCK=true` |

When mock mode is on, HTTP repositories are replaced with in-memory mocks.
Mobile mock mode skips SQLite sync and uses mocks directly.

## Profile Page Differences

**Web `/profile`:**
- Shows all active sessions from API
- Terminate button calls API immediately
- Current session highlighted by userAgent match

**Mobile `profile` screen:**
- Shows cached sessions from SQLite
- Terminate only works when online (queues action otherwise)
- Shows "Current device" for the local session

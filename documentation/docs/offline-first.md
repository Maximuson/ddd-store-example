---
sidebar_position: 6
---

# Offline-First Architecture (Mobile)

## Principle

> The local database (SQLite) is the **source of truth for the UI**.
> The API is the source of truth for **fresh data** when online.

Whether online or offline, the UI always reads through the same path:

```
SQLite → Repository → Use Case → UI
```

## SQLite Schema

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL
);

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  device_type TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_activity_at TEXT NOT NULL,
  expires_at TEXT,
  is_current INTEGER DEFAULT 0
);

CREATE TABLE auth_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TEXT
);

CREATE TABLE sync_metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

## Sync Protocol

### When Sync Runs

1. App launch (if online)
2. App returns to foreground (if online)
3. Network connectivity restored
4. After successful login

### Sync Steps

```
1. Check network connectivity
2. If offline → skip, UI reads from SQLite
3. If online:
   a. Refresh auth token if needed (POST /auth/refresh)
   b. GET /products → upsert into products table
   c. GET /users/me → upsert into users table
   d. GET /users/me/sessions → upsert into sessions table
   e. UPDATE sync_metadata SET value = NOW() WHERE key = 'lastSyncedAt'
```

### Conflict Resolution

This MVP uses **server-wins** strategy:
- Server data always overwrites local cache on sync
- No local mutations to products (read-only catalog on mobile)
- Session termination requires network

## Repository Pattern for Offline

```typescript
// Mobile DI container always wires SQLite repos for reads
const productRepository = new SqliteProductRepository(sqliteDb);
const getProductsUseCase = new GetProductsUseCase(productRepository);

// Sync service uses HTTP repos to populate SQLite
const syncService = new SyncService({
  httpProductRepo: new HttpProductRepository(apiClient),
  sqliteProductRepo: productRepository,
  // ...
});
```

The use case does not know about sync — it always reads SQLite.

## Stale Data UX

When offline, the app shows a banner:

```
⚠ Offline mode — Showing cached data from: 2026-07-16 10:30
```

Implementation:
```typescript
const lastSyncedAt = await syncMetadataRepo.get('lastSyncedAt');
const isOnline = useNetworkStatus();

if (!isOnline) {
  return <OfflineBanner lastSyncedAt={lastSyncedAt} />;
}
```

## What Works Offline

| Feature | Offline |
|---------|---------|
| Browse catalog | Yes (cached products) |
| View product detail | Yes (cached) |
| View profile | Yes (cached user) |
| View sessions list | Yes (cached) |
| Login | No |
| Logout | No (clears local only) |
| Terminate session | No |
| Sync fresh data | No |

## Future Improvements (not in MVP)

- Optimistic writes with sync queue
- Conflict resolution for user profile edits
- Background sync with expo-background-fetch
- Incremental sync with `updatedSince` query param

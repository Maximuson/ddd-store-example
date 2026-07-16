import type { RouteGuard } from '../spec/PageDefinition';

export function requiresAuth(guard: RouteGuard): boolean {
  return guard === 'authenticated' || guard === 'admin';
}

export function requiresAdmin(guard: RouteGuard): boolean {
  return guard === 'admin';
}

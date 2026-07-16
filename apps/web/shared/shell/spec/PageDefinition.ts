export type RouteGuard = 'public' | 'authenticated' | 'admin';

export interface PageDefinition {
  readonly id: string;
  readonly path: string;
  readonly title: string;
  readonly guard: RouteGuard;
}

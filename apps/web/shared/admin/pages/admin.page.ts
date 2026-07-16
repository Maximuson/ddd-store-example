import type { PageDefinition } from '../../shell/spec/PageDefinition';

export const adminPage = {
  id: 'admin',
  path: '/admin',
  title: 'Admin Panel',
  guard: 'admin',
} as const satisfies PageDefinition;

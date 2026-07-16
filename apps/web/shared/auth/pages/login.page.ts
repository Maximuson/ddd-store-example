import type { PageDefinition } from '../../shell/spec/PageDefinition';

export const loginPage = {
  id: 'login',
  path: '/login',
  title: 'Sign In',
  guard: 'public',
} as const satisfies PageDefinition;

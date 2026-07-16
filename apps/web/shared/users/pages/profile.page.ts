import type { PageDefinition } from '../../shell/spec/PageDefinition';

export const profilePage = {
  id: 'profile',
  path: '/profile',
  title: 'My Profile',
  guard: 'authenticated',
} as const satisfies PageDefinition;

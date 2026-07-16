import type { PageDefinition } from '../../shell/spec/PageDefinition';

export const catalogPage = {
  id: 'catalog',
  path: '/catalog',
  title: 'Product Catalog',
  guard: 'authenticated',
} as const satisfies PageDefinition;

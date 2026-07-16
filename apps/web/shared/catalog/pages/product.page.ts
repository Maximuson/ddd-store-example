import type { PageDefinition } from '../../shell/spec/PageDefinition';

export const productPage = {
  id: 'product',
  path: '/product/:id',
  title: 'Product Details',
  guard: 'authenticated',
} as const satisfies PageDefinition;

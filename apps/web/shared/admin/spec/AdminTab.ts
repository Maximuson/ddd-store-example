export type AdminTab = 'users' | 'sessions' | 'products';

export const ADMIN_TABS: readonly AdminTab[] = ['users', 'sessions', 'products'] as const;

export const emptyProductForm = {
  title: '',
  description: '',
  price: 0,
  image: '',
  category: '',
} as const;

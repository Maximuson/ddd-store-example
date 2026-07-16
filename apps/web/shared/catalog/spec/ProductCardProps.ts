import type { Product } from '@ddd-store/catalog';

export interface ProductCardProps {
  readonly product: Product;
  readonly href: string;
}

export interface ProductListProps {
  readonly products: Product[];
  readonly isLoading?: boolean;
  readonly getProductHref: (id: string) => string;
}

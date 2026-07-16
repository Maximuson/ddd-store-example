import type { ProductListProps } from '@ddd-store/web-shared/catalog';
import { ProductCard } from './ProductCard';

export function ProductList({ products, isLoading, getProductHref }: ProductListProps) {
  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading products...</div>;
  }

  if (products.length === 0) {
    return <div className="text-center py-12 text-gray-500">No products found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.getId()}
          product={product}
          href={getProductHref(product.getId())}
        />
      ))}
    </div>
  );
}

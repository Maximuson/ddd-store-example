import { useEffect } from 'react';
import { useCatalog, ProductList } from '@ddd-store/catalog';
import { useContainer } from '../di/ContainerContext';

export function CatalogPage() {
  const { getProductsUseCase } = useContainer();
  const { products, loading, error, fetch } = useCatalog(getProductsUseCase);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Catalog</h1>
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      <ProductList products={products} isLoading={loading} />
    </div>
  );
}

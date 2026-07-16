import { useEffect } from 'react';
import { catalogPage } from '@ddd-store/web-shared/catalog';
import { useContainer } from '../../di/ContainerContext';
import { ProductList } from './components/ProductList';
import { useCatalog } from './hooks/useCatalog';

export function CatalogPage() {
  const { getProductsUseCase } = useContainer();
  const { products, loading, error, fetch } = useCatalog(getProductsUseCase);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{catalogPage.title}</h1>
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
      )}
      <ProductList
        products={products}
        isLoading={loading}
        getProductHref={(id) => `/product/${id}`}
      />
    </div>
  );
}

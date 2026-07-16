import { useActor } from '@xstate/react';
import { createCatalogMachine, ProductList } from '@ddd-store/catalog';
import { useContainer } from '../di/ContainerContext';
import { useMemo } from 'react';

export function CatalogPage() {
  const { getProductsUseCase } = useContainer();
  const machine = useMemo(() => createCatalogMachine(getProductsUseCase), [getProductsUseCase]);
  const [state] = useActor(machine);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Catalog</h1>
      {state.matches('error') && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">
          {state.context.error}
        </div>
      )}
      <ProductList
        products={state.context.products}
        isLoading={state.matches('loading')}
      />
    </div>
  );
}

import { useCallback } from 'react';
import { useSelector, useStore } from '@xstate/store-react';
import { GetProductsUseCase } from '../../application/use-cases';
import { catalogStoreLogic } from '../stores/catalogStore';

export function useCatalog(getProductsUseCase: GetProductsUseCase) {
  const store = useStore(catalogStoreLogic);
  const data = useSelector(store, (s) => s.context.data);
  const loading = useSelector(store, (s) => s.context.loading);
  const error = useSelector(store, (s) => s.context.error);

  const fetch = useCallback(async () => {
    store.trigger.setLoading();
    try {
      const products = await getProductsUseCase.execute();
      store.trigger.setData({ data: products });
    } catch (e) {
      store.trigger.setError({
        error: e instanceof Error ? e.message : 'Failed to load products',
      });
    }
  }, [store, getProductsUseCase]);

  return { products: data ?? [], loading, error, fetch };
}

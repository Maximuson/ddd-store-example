import { useCallback } from 'react';
import { useSelector, useStore } from '@xstate/store-react';
import { GetProductByIdUseCase } from '../../application/use-cases';
import { productStoreLogic } from '../stores/productStore';

export function useProduct(getProductByIdUseCase: GetProductByIdUseCase) {
  const store = useStore(productStoreLogic);
  const product = useSelector(store, (s) => s.context.data);
  const loading = useSelector(store, (s) => s.context.loading);
  const error = useSelector(store, (s) => s.context.error);

  const fetch = useCallback(
    async (id: string) => {
      store.trigger.setLoading();
      try {
        const result = await getProductByIdUseCase.execute(id);
        store.trigger.setData({ data: result });
      } catch (e) {
        store.trigger.setError({
          error: e instanceof Error ? e.message : 'Product not found',
        });
      }
    },
    [store, getProductByIdUseCase],
  );

  return { product, loading, error, fetch };
}

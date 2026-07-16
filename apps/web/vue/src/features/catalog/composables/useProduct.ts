import { onScopeDispose, ref } from 'vue';
import { productStoreLogic } from '@ddd-store/web-shared/catalog';
import type { GetProductByIdUseCase } from '@ddd-store/catalog';

const store = productStoreLogic.createStore();

export function useProduct(getProductByIdUseCase: GetProductByIdUseCase) {
  const snapshot = ref(store.get());
  const sub = store.subscribe(() => {
    snapshot.value = store.get();
  });
  onScopeDispose(() => sub.unsubscribe());

  async function fetch(id: string) {
    store.trigger.setLoading();
    try {
      const result = await getProductByIdUseCase.execute(id);
      store.trigger.setData({ data: result });
    } catch (e) {
      store.trigger.setError({
        error: e instanceof Error ? e.message : 'Product not found',
      });
    }
  }

  return {
    product: () => snapshot.value.context.data,
    loading: () => snapshot.value.context.loading,
    error: () => snapshot.value.context.error,
    fetch,
  };
}

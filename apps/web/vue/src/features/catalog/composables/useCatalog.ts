import { onScopeDispose, ref } from 'vue';
import { catalogStoreLogic } from '@ddd-store/web-shared/catalog';
import type { GetProductsUseCase } from '@ddd-store/catalog';

const store = catalogStoreLogic.createStore();

export function useCatalog(getProductsUseCase: GetProductsUseCase) {
  const snapshot = ref(store.get());
  const sub = store.subscribe(() => {
    snapshot.value = store.get();
  });
  onScopeDispose(() => sub.unsubscribe());

  const products = () => snapshot.value.context.data ?? [];
  const loading = () => snapshot.value.context.loading;
  const error = () => snapshot.value.context.error;

  async function fetch() {
    store.trigger.setLoading();
    try {
      const result = await getProductsUseCase.execute();
      store.trigger.setData({ data: result });
    } catch (e) {
      store.trigger.setError({
        error: e instanceof Error ? e.message : 'Failed to load products',
      });
    }
  }

  return { products, loading, error, fetch, snapshot };
}

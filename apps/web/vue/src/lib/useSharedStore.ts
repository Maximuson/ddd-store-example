import type { StoreLogicCreator } from '@xstate/store';
import { onScopeDispose, ref } from 'vue';

type StoreInstance = ReturnType<StoreLogicCreator<unknown, never, never, void, object>['createStore']>;

export function useSharedStore<T extends StoreInstance>(
  logic: { createStore: () => T },
): T {
  const store = logic.createStore();
  const snapshot = ref(store.get());

  const sub = store.subscribe(() => {
    snapshot.value = store.get();
  });

  onScopeDispose(() => sub.unsubscribe());

  return store;
}

export function useStoreSelector<TStore extends StoreInstance, TSelected>(
  store: TStore,
  selector: (snapshot: ReturnType<TStore['get']>) => TSelected,
) {
  const selected = ref(selector(store.get()));
  const sub = store.subscribe(() => {
    selected.value = selector(store.get());
  });
  onScopeDispose(() => sub.unsubscribe());
  return selected;
}

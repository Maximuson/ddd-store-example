import { createStoreLogic } from '@xstate/store';

export interface AsyncStoreContext<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function createAsyncStoreLogic<T>() {
  return createStoreLogic({
    context: { data: null as T | null, loading: false, error: null as string | null },
    on: {
      setLoading: (ctx) => ({ ...ctx, loading: true, error: null }),
      setData: (ctx, event: { data: T }) => ({
        ...ctx,
        data: event.data,
        loading: false,
        error: null,
      }),
      setError: (ctx, event: { error: string }) => ({
        ...ctx,
        loading: false,
        error: event.error,
      }),
      reset: () => ({ data: null, loading: false, error: null }),
    },
  });
}

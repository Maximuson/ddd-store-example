import { setup, assign, fromPromise } from 'xstate';
import { GetProductsUseCase } from '../../application/use-cases';
import { Product } from '../../domain/entities/Product';

export interface CatalogContext {
  products: Product[];
  error: string | null;
}

export function createCatalogMachine(getProductsUseCase: GetProductsUseCase) {
  return setup({
    types: {
      context: {} as CatalogContext,
      events: {} as { type: 'FETCH' },
    },
    actors: {
      fetchProducts: fromPromise(async () => getProductsUseCase.execute()),
    },
  }).createMachine({
    id: 'catalog',
    initial: 'loading',
    context: { products: [], error: null },
    states: {
      loading: {
        invoke: {
          src: 'fetchProducts',
          onDone: {
            target: 'success',
            actions: assign({
              products: ({ event }) => event.output as Product[],
              error: null,
            }),
          },
          onError: {
            target: 'error',
            actions: assign({
              error: ({ event }) =>
                event.error instanceof Error ? event.error.message : 'Failed to load products',
            }),
          },
        },
      },
      success: {
        on: { FETCH: { target: 'loading' } },
      },
      error: {
        on: { FETCH: { target: 'loading', actions: assign({ error: null }) } },
      },
    },
  });
}

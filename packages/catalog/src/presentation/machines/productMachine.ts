import { setup, assign, fromPromise } from 'xstate';
import { GetProductByIdUseCase } from '../../application/use-cases';
import { Product } from '../../domain/entities/Product';

export function createProductMachine(getProductByIdUseCase: GetProductByIdUseCase) {
  return setup({
    types: {
      context: {} as { product: Product | null; error: string | null },
      events: {} as { type: 'FETCH'; id: string },
    },
    actors: {
      fetchProduct: fromPromise(async ({ input }: { input: string }) =>
        getProductByIdUseCase.execute(input),
      ),
    },
  }).createMachine({
    id: 'product',
    initial: 'idle',
    context: { product: null, error: null },
    states: {
      idle: {
        on: { FETCH: { target: 'loading' } },
      },
      loading: {
        invoke: {
          src: 'fetchProduct',
          input: ({ event }) => (event as { type: 'FETCH'; id: string }).id,
          onDone: {
            target: 'success',
            actions: assign({
              product: ({ event }) => event.output as Product,
              error: null,
            }),
          },
          onError: {
            target: 'error',
            actions: assign({
              error: ({ event }) =>
                event.error instanceof Error ? event.error.message : 'Product not found',
            }),
          },
        },
      },
      success: {},
      error: {
        on: { FETCH: { target: 'loading' } },
      },
    },
  });
}

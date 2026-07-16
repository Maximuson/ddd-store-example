import { createAsyncStoreLogic } from '@ddd-store/shared';
import { Product } from '@ddd-store/catalog';

export const catalogStoreLogic = createAsyncStoreLogic<Product[]>();

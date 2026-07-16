import { createAsyncStoreLogic } from '@ddd-store/shared';
import { Product } from '../../domain/entities/Product';

export const productStoreLogic = createAsyncStoreLogic<Product>();

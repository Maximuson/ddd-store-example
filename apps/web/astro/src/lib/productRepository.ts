import { createApiClient } from '@ddd-store/shared/api';
import {
  GetProductsUseCase,
  MockProductRepository,
  HttpProductRepository,
  type Product,
  type ProductRepository,
} from '@ddd-store/catalog';

const useMock = import.meta.env.VITE_USE_MOCK !== 'false';
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export function createProductRepository(): ProductRepository {
  return useMock
    ? new MockProductRepository()
    : new HttpProductRepository(createApiClient(apiUrl));
}

export function isMockMode(): boolean {
  return useMock;
}

export async function getProducts(): Promise<Product[]> {
  return new GetProductsUseCase(createProductRepository()).execute();
}

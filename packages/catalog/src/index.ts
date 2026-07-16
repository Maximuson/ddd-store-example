// Domain
export { Product } from './domain/entities/Product';
export type {
  ProductRepository,
  CreateProductData,
  UpdateProductData,
} from './domain/repositories/ProductRepository';

// Application
export {
  GetProductsUseCase,
  GetProductByIdUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
} from './application/use-cases';

// Infrastructure
export { MockProductRepository, mockProductsData } from './infrastructure/mocks/MockProductRepository';
export { HttpProductRepository } from './infrastructure/api/HttpProductRepository';
export { mapProductDtoToEntity, type ProductDto } from './infrastructure/mappers/productMapper';

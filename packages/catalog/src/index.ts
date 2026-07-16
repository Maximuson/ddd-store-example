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

// Presentation
export { ProductCard, ProductList } from './presentation/components/ProductList';
export { catalogStoreLogic } from './presentation/stores/catalogStore';
export { productStoreLogic } from './presentation/stores/productStore';
export { useCatalog } from './presentation/hooks/useCatalog';
export { useProduct } from './presentation/hooks/useProduct';

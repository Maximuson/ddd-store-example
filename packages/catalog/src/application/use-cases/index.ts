import { NotFoundError, ValidationError } from '@ddd-store/shared';
import { ProductRepository, CreateProductData, UpdateProductData } from '../../domain/repositories/ProductRepository';
import { Product } from '../../domain/entities/Product';

export class GetProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.getProducts();
  }
}

export class GetProductByIdUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productRepository.getProductById(id);
    if (!product) throw new NotFoundError('Product not found');
    return product;
  }
}

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(data: CreateProductData): Promise<Product> {
    if (!data.title?.trim()) throw new ValidationError('Title is required');
    if (data.price < 0) throw new ValidationError('Price cannot be negative');
    return this.productRepository.create(data);
  }
}

export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string, data: UpdateProductData): Promise<Product> {
    const existing = await this.productRepository.getProductById(id);
    if (!existing) throw new NotFoundError('Product not found');
    return this.productRepository.update(id, data);
  }
}

export class DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.productRepository.getProductById(id);
    if (!existing) throw new NotFoundError('Product not found');
    await this.productRepository.delete(id);
  }
}

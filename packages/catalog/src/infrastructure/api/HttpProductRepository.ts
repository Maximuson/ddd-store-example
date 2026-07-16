import { Product } from '../../domain/entities/Product';
import { ProductRepository, CreateProductData, UpdateProductData } from '../../domain/repositories/ProductRepository';
import { mapProductDtoToEntity, ProductDto } from '../mappers/productMapper';
import { ApiClient } from '@ddd-store/shared/api';

export class HttpProductRepository implements ProductRepository {
  constructor(private readonly client: ApiClient) {}

  async getProducts(): Promise<Product[]> {
    const dtos = await this.client.get<ProductDto[]>('/products');
    return dtos.map(mapProductDtoToEntity);
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const dto = await this.client.get<ProductDto>(`/products/${id}`);
      return mapProductDtoToEntity(dto);
    } catch {
      return null;
    }
  }

  async create(data: CreateProductData): Promise<Product> {
    const dto = await this.client.post<ProductDto>('/admin/products', data);
    return mapProductDtoToEntity(dto);
  }

  async update(id: string, data: UpdateProductData): Promise<Product> {
    const dto = await this.client.patch<ProductDto>(`/admin/products/${id}`, data);
    return mapProductDtoToEntity(dto);
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`/admin/products/${id}`);
  }
}

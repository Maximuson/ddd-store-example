import { Product } from '../../domain/entities/Product';

export interface ProductDto {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  createdAt: string;
}

export function mapProductDtoToEntity(dto: ProductDto): Product {
  return Product.create({
    id: dto.id,
    title: dto.title,
    description: dto.description,
    price: dto.price,
    image: dto.image,
    category: dto.category,
    createdAt: new Date(dto.createdAt),
  });
}

export function mapProductEntityToDto(product: Product): ProductDto {
  const json = product.toJSON();
  return {
    ...json,
    createdAt: json.createdAt.toISOString(),
  };
}

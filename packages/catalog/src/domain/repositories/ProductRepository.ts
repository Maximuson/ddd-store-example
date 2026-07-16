import { Product } from '../entities/Product';

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface UpdateProductData {
  title?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
}

export interface ProductRepository {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  create(data: CreateProductData): Promise<Product>;
  update(id: string, data: UpdateProductData): Promise<Product>;
  delete(id: string): Promise<void>;
}

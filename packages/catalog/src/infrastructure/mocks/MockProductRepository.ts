import { Product } from '../../domain/entities/Product';
import { CreateProductData, UpdateProductData, ProductRepository } from '../../domain/repositories/ProductRepository';

export const mockProductsData: Product[] = [
  Product.create({
    id: 'p1',
    title: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30h battery life.',
    price: 199.99,
    image: 'https://picsum.photos/seed/headphones/400/300',
    category: 'Electronics',
    createdAt: new Date('2026-01-15'),
  }),
  Product.create({
    id: 'p2',
    title: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with Cherry MX switches.',
    price: 149.99,
    image: 'https://picsum.photos/seed/keyboard/400/300',
    category: 'Electronics',
    createdAt: new Date('2026-01-20'),
  }),
  Product.create({
    id: 'p3',
    title: 'Running Shoes',
    description: 'Lightweight running shoes with responsive cushioning.',
    price: 129.99,
    image: 'https://picsum.photos/seed/shoes/400/300',
    category: 'Sports',
    createdAt: new Date('2026-02-01'),
  }),
  Product.create({
    id: 'p4',
    title: 'Coffee Maker',
    description: 'Programmable drip coffee maker with thermal carafe.',
    price: 79.99,
    image: 'https://picsum.photos/seed/coffee/400/300',
    category: 'Home',
    createdAt: new Date('2026-02-10'),
  }),
  Product.create({
    id: 'p5',
    title: 'Yoga Mat',
    description: 'Non-slip eco-friendly yoga mat, 6mm thick.',
    price: 39.99,
    image: 'https://picsum.photos/seed/yoga/400/300',
    category: 'Sports',
    createdAt: new Date('2026-02-15'),
  }),
  Product.create({
    id: 'p6',
    title: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness and color temperature.',
    price: 49.99,
    image: 'https://picsum.photos/seed/lamp/400/300',
    category: 'Home',
    createdAt: new Date('2026-03-01'),
  }),
  Product.create({
    id: 'p7',
    title: 'Backpack',
    description: 'Water-resistant laptop backpack with USB charging port.',
    price: 59.99,
    image: 'https://picsum.photos/seed/backpack/400/300',
    category: 'Accessories',
    createdAt: new Date('2026-03-10'),
  }),
  Product.create({
    id: 'p8',
    title: 'Smart Watch',
    description: 'Fitness tracker with heart rate monitor and GPS.',
    price: 249.99,
    image: 'https://picsum.photos/seed/watch/400/300',
    category: 'Electronics',
    createdAt: new Date('2026-03-15'),
  }),
  Product.create({
    id: 'p9',
    title: 'Plant Pot Set',
    description: 'Ceramic plant pot set of 3 with drainage trays.',
    price: 34.99,
    image: 'https://picsum.photos/seed/plants/400/300',
    category: 'Home',
    createdAt: new Date('2026-04-01'),
  }),
  Product.create({
    id: 'p10',
    title: 'Water Bottle',
    description: 'Insulated stainless steel water bottle, 32oz.',
    price: 24.99,
    image: 'https://picsum.photos/seed/bottle/400/300',
    category: 'Sports',
    createdAt: new Date('2026-04-10'),
  }),
  Product.create({
    id: 'p11',
    title: 'Bluetooth Speaker',
    description: 'Portable waterproof Bluetooth speaker with 12h playtime.',
    price: 89.99,
    image: 'https://picsum.photos/seed/speaker/400/300',
    category: 'Electronics',
    createdAt: new Date('2026-05-01'),
  }),
  Product.create({
    id: 'p12',
    title: 'Sunglasses',
    description: 'Polarized UV400 protection sunglasses.',
    price: 69.99,
    image: 'https://picsum.photos/seed/sunglasses/400/300',
    category: 'Accessories',
    createdAt: new Date('2026-05-15'),
  }),
];

export class MockProductRepository implements ProductRepository {
  private products = [...mockProductsData];

  async getProducts(): Promise<Product[]> {
    return [...this.products];
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.products.find((p) => p.getId() === id) ?? null;
  }

  async create(data: CreateProductData): Promise<Product> {
    const product = Product.create({
      id: `p${Date.now()}`,
      ...data,
      createdAt: new Date(),
    });
    this.products.push(product);
    return product;
  }

  async update(id: string, data: UpdateProductData): Promise<Product> {
    const index = this.products.findIndex((p) => p.getId() === id);
    if (index < 0) throw new Error('Product not found');
    const current = this.products[index]!;
    const json = current.toJSON();
    const updated = Product.create({
      id: json.id,
      title: data.title ?? json.title,
      description: data.description ?? json.description,
      price: data.price ?? json.price,
      image: data.image ?? json.image,
      category: data.category ?? json.category,
      createdAt: json.createdAt,
    });
    this.products[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.products = this.products.filter((p) => p.getId() !== id);
  }
}

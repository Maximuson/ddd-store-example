import { Product } from '@ddd-store/catalog';
import { ProductRepository, CreateProductData, UpdateProductData } from '@ddd-store/catalog';
import { getDatabase } from '../sqlite';

export class SqliteProductRepository implements ProductRepository {
  async getProducts(): Promise<Product[]> {
    const db = getDatabase();
    const rows = db.getAllSync<{
      id: string;
      title: string;
      description: string;
      price: number;
      image: string;
      category: string;
      created_at: string;
    }>('SELECT * FROM products ORDER BY created_at DESC');

    return rows.map((row) =>
      Product.create({
        id: row.id,
        title: row.title,
        description: row.description,
        price: row.price,
        image: row.image,
        category: row.category,
        createdAt: new Date(row.created_at),
      }),
    );
  }

  async getProductById(id: string): Promise<Product | null> {
    const db = getDatabase();
    const row = db.getFirstSync<{
      id: string;
      title: string;
      description: string;
      price: number;
      image: string;
      category: string;
      created_at: string;
    }>('SELECT * FROM products WHERE id = ?', [id]);

    if (!row) return null;
    return Product.create({
      id: row.id,
      title: row.title,
      description: row.description,
      price: row.price,
      image: row.image,
      category: row.category,
      createdAt: new Date(row.created_at),
    });
  }

  async create(data: CreateProductData): Promise<Product> {
    throw new Error('Create not supported on mobile SQLite');
  }

  async update(_id: string, _data: UpdateProductData): Promise<Product> {
    throw new Error('Update not supported on mobile SQLite');
  }

  async delete(_id: string): Promise<void> {
    throw new Error('Delete not supported on mobile SQLite');
  }

  upsertProduct(product: Product): void {
    const db = getDatabase();
    const json = product.toJSON();
    db.runSync(
      `INSERT OR REPLACE INTO products (id, title, description, price, image, category, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [json.id, json.title, json.description, json.price, json.image, json.category, json.createdAt.toISOString()],
    );
  }

  upsertProducts(products: Product[]): void {
    products.forEach((p) => this.upsertProduct(p));
  }
}

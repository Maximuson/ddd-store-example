import { describe, it, expect } from 'vitest';
import { Product } from './Product';
import { Money } from '@ddd-store/shared';

describe('Product', () => {
  it('cannot have negative price', () => {
    expect(() =>
      Product.create({
        id: '1',
        title: 'Test',
        description: 'Desc',
        price: -5,
        image: '',
        category: 'Test',
        createdAt: new Date(),
      }),
    ).toThrow('Price cannot be negative');
  });

  it('creates product with valid data', () => {
    const product = Product.create({
      id: '1',
      title: 'Widget',
      description: 'A widget',
      price: 19.99,
      image: '/img.jpg',
      category: 'Gadgets',
      createdAt: new Date('2026-01-01'),
    });
    expect(product.getTitle()).toBe('Widget');
    expect(product.getPrice().getAmount()).toBe(19.99);
  });
});

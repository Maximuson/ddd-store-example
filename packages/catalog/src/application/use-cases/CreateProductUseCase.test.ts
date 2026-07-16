import { describe, it, expect, beforeEach } from 'vitest';
import { CreateProductUseCase } from '../../application/use-cases';
import { MockProductRepository } from '../../infrastructure/mocks/MockProductRepository';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;

  beforeEach(() => {
    useCase = new CreateProductUseCase(new MockProductRepository());
  });

  it('rejects empty title', async () => {
    await expect(
      useCase.execute({ title: '', description: 'd', price: 10, image: '', category: 'c' }),
    ).rejects.toThrow('Title is required');
  });

  it('creates product with valid data', async () => {
    const product = await useCase.execute({
      title: 'New Product',
      description: 'Description',
      price: 29.99,
      image: '/img.jpg',
      category: 'Electronics',
    });
    expect(product.getTitle()).toBe('New Product');
  });
});

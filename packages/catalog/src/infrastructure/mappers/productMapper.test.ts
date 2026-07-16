import { describe, it, expect } from 'vitest';
import { mapProductDtoToEntity } from './productMapper';

describe('mapProductDtoToEntity', () => {
  it('maps DTO to domain entity', () => {
    const entity = mapProductDtoToEntity({
      id: 'p1',
      title: 'Test Product',
      description: 'Description',
      price: 19.99,
      image: '/img.jpg',
      category: 'Test',
      createdAt: '2026-01-01T00:00:00.000Z',
    });
    expect(entity.getTitle()).toBe('Test Product');
    expect(entity.getPrice().getAmount()).toBe(19.99);
  });
});

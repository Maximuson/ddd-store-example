import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const products = await this.prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    return products.map(this.toDto);
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return this.toDto(product);
  }

  async create(data: { title: string; description: string; price: number; image: string; category: string }) {
    const product = await this.prisma.product.create({ data });
    return this.toDto(product);
  }

  async update(id: string, data: Partial<{ title: string; description: string; price: number; image: string; category: string }>) {
    const product = await this.prisma.product.update({ where: { id }, data });
    return this.toDto(product);
  }

  async delete(id: string) {
    await this.prisma.product.delete({ where: { id } });
  }

  private toDto(product: {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    category: string;
    createdAt: Date;
  }) {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      createdAt: product.createdAt.toISOString(),
    };
  }
}

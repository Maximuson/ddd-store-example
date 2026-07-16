import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UsersService } from '../users/application/users.service';
import { CatalogService } from '../catalog/application/catalog.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

class CreateProductDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  image!: string;

  @IsString()
  category!: string;
}

class UpdateProductDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  category?: string;
}

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(
    private usersService: UsersService,
    private catalogService: CatalogService,
    private prisma: PrismaService,
  ) {}

  @Get('users')
  listUsers() {
    return this.usersService.listAll();
  }

  @Get('sessions')
  async listSessions() {
    const sessions = await this.prisma.session.findMany({
      orderBy: { lastActivityAt: 'desc' },
    });
    return sessions.map((s) => ({
      id: s.id,
      userId: s.userId,
      deviceType: s.deviceType,
      userAgent: s.userAgent,
      createdAt: s.createdAt.toISOString(),
      lastActivityAt: s.lastActivityAt.toISOString(),
      expiresAt: s.expiresAt?.toISOString() ?? null,
    }));
  }

  @Post('products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.catalogService.create(dto);
  }

  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.catalogService.update(id, dto);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.catalogService.delete(id);
  }
}

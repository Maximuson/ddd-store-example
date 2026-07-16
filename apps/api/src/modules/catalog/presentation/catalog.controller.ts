import { Controller, Get, Param } from '@nestjs/common';
import { CatalogService } from '../application/catalog.service';

@Controller('products')
export class CatalogController {
  constructor(private catalogService: CatalogService) {}

  @Get()
  findAll() {
    return this.catalogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogService.findOne(id);
  }
}

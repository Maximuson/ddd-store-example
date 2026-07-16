import { Module } from '@nestjs/common';
import { CatalogController } from './presentation/catalog.controller';
import { CatalogService } from './application/catalog.service';

@Module({
  controllers: [CatalogController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}

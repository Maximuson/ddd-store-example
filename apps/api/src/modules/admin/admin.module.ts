import { Module } from '@nestjs/common';
import { AdminController } from './presentation/admin.controller';
import { UsersModule } from '../users/users.module';
import { CatalogModule } from '../catalog/catalog.module';

@Module({
  imports: [UsersModule, CatalogModule],
  controllers: [AdminController],
})
export class AdminModule {}

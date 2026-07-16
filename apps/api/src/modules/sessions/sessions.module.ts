import { Module } from '@nestjs/common';
import { SessionsController } from './presentation/sessions.controller';
import { SessionsService } from './application/sessions.service';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}

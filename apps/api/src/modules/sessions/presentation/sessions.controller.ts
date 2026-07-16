import { Controller, Delete, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SessionsService } from '../application/sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  terminate(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.sessionsService.terminate(id, req.user.id);
  }

  @Patch(':id/activity')
  @UseGuards(AuthGuard('jwt'))
  updateActivity(@Param('id') id: string) {
    return this.sessionsService.updateActivity(id);
  }
}

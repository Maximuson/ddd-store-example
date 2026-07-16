import { Controller, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../application/users.service';
import { IsOptional, IsString } from 'class-validator';

class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@Request() req: { user: { id: string } }) {
    return this.usersService.getMe(req.user.id);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  updateMe(@Request() req: { user: { id: string } }, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateMe(req.user.id, dto);
  }

  @Get('me/sessions')
  @UseGuards(AuthGuard('jwt'))
  getSessions(@Request() req: { user: { id: string } }) {
    return this.usersService.getSessions(req.user.id);
  }

  @Get('by-email/:email')
  @UseGuards(AuthGuard('jwt'))
  getByEmail(@Param('email') email: string) {
    return this.usersService.getByEmail(email);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getById(@Param('id') id: string) {
    return this.usersService.getById(id);
  }
}

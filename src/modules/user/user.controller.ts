import { JwtAuthGuard } from '#/common/guards/jwt.guard';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  getUser(@Req() req: Request) {
    return 'test';
  }
}

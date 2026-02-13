import { JwtAuthGuard } from '#/common/guards/jwt.guard';
import { Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @HttpCode(200)
  read() {
    return 'test';
  }

  @Post('/')
  @HttpCode(200)
  create() {
    return 'test';
  }
}

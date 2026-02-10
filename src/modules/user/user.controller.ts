import { JwtAuthGuard } from '#/common/guards/jwt.guard';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @HttpCode(200)
  getUser(@Req() req: Request) {
    return 'test';
  }

  @Post('/')
  @HttpCode(200)
  createUser(@Req() req: Request, @Body() body: any) {
    return 'test';
  }
}

import { AuthService } from '#/modules/auth/auth.service';
import { LoginDTO } from '#/modules/auth/dto/login.dto';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  async login(@Body() body: LoginDTO) {
    return await this.auth.login(body);
  }
}

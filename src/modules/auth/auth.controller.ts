import { JwtRefreshAuthGuard } from '#/common/guards/refresh-jwt.guard';
import { AuthService } from '#/modules/auth/auth.service';
import { LoginDTO } from '#/modules/auth/dto';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(body);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false, // postman
      sameSite: 'strict',
      path: '/auth/refresh',
      // secure: true,
    });

    return { accessToken };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      req.auth?.sub,
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      // secure: false,
      sameSite: 'strict',
      path: '/auth/refresh',
    });

    return { accessToken };
  }
}

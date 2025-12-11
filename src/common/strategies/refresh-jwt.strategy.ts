import { UserPayload } from '#/common/types/user-payload.type';
import { PrismaService } from '#/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (req: Request) => req?.cookies?.refresh_token ?? null,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: UserPayload) {
    const refreshToken = req?.cookies?.refresh_token;
    if (!refreshToken) throw new UnauthorizedException('Refresh token hilang');

    const user = await this.prisma.user.findUnique({
      where: { unique_code: payload.sub, deleted_at: null },
      select: {
        user_authentication: {
          select: { refresh_token: true },
        },
      },
    });

    if (!user?.user_authentication?.refresh_token)
      throw new UnauthorizedException('User tidak punya refresh token');

    const valid = await bcrypt.compare(
      refreshToken,
      user.user_authentication.refresh_token,
    );

    if (!valid) throw new UnauthorizedException('Refresh token tidak valid');

    req.auth = payload;
    return payload;
  }
}

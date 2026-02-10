import { TUserPayload } from '#/common/types/user-payload.type';
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
      jwtFromRequest: (req: Request) =>
        (req?.cookies as Record<string, string>)?.refresh_token ?? null,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: TUserPayload): Promise<TUserPayload> {
    const refreshToken = (req.cookies as Record<string, string>)?.refresh_token;
    if (!refreshToken) throw new UnauthorizedException('Refresh token hilang');

    const user = await this.prisma.users.findUnique({
      where: { unique_code: payload.sub, deleted_at: null },
      select: {
        user_authentication: {
          select: { refresh_token: true },
        },
      },
    });

    const storedToken = user?.user_authentication?.refresh_token;
    if (!storedToken)
      throw new UnauthorizedException('User tidak punya refresh token');

    const valid = await bcrypt.compare(refreshToken, storedToken);
    if (!valid) throw new UnauthorizedException('Refresh token tidak valid');

    req.auth = payload;
    return payload;
  }
}

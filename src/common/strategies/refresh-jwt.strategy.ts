import { TUserPayload } from '#/common/types/user-payload.type';
import { UserRepository } from '#/modules/user/user.repository';
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
    private readonly userRepository: UserRepository,
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
    if (!refreshToken)
      throw new UnauthorizedException(
        'Sesi Anda telah berakhir. Silakan login kembali.',
      );

    const user = await this.userRepository.findActiveAuthUser(payload.sub);
    if (!user)
      throw new UnauthorizedException(
        'Sesi Anda telah berakhir atau akun tidak aktif. Silakan login kembali.',
      );

    const storedToken = user.user_authentication?.refresh_token;
    if (!storedToken)
      throw new UnauthorizedException(
        'Sesi Anda telah berakhir. Silakan login kembali.',
      );

    const valid = await bcrypt.compare(refreshToken, storedToken);
    if (!valid)
      throw new UnauthorizedException(
        'Sesi Anda telah berakhir. Silakan login kembali.',
      );

    req.auth = payload;
    return payload;
  }
}

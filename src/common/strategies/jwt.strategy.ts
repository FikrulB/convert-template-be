import { TUserPayload } from '#/common/types/user-payload.type';
import { UserProjection } from '#/modules/user/user.projection';
import { UserRepository } from '#/modules/user/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: TUserPayload) {
    const user = await this.userRepository.findActiveAuthUser(
      UserProjection.base,
      payload.sub,
    );

    if (!user)
      throw new UnauthorizedException(
        'Sesi Anda telah berakhir atau akun tidak aktif. Silakan login kembali.',
      );

    req.auth = payload;
    return payload;
  }
}

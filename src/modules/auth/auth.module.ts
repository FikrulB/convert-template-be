import { JwtStrategy } from '#/common/strategies/jwt.strategy';
import { RefreshJwtStrategy } from '#/common/strategies/refresh-jwt.strategy';
import { HashService } from '#/common/utils/encrypt.util';
import { AuthController } from '#/modules/auth/auth.controller';
import { AuthRepository } from '#/modules/auth/auth.repository';
import { AuthService } from '#/modules/auth/auth.service';
import { UserRepository } from '#/modules/user/user.repository';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    UserRepository,
    AuthRepository,
    AuthService,
    JwtStrategy,
    RefreshJwtStrategy,
    HashService,
  ],
})
export class AuthModule {}

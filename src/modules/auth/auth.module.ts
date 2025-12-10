import { AuthController } from '#/modules/auth/auth.controller';
import { AuthRepository } from '#/modules/auth/auth.repository';
import { AuthService } from '#/modules/auth/auth.service';
import { UserRepository } from '#/modules/user/user.repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [UserRepository, AuthRepository, AuthService],
})
export class AuthModule {}

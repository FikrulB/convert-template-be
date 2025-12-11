import { PrismaService } from '#/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async saveTokens(
    userId: number | bigint,
    accessToken: string,
    refreshToken?: string,
  ) {
    await this.prisma.user_authentication.upsert({
      where: { user_id: userId },
      update: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
      create: {
        access_token: accessToken,
        refresh_token: refreshToken,
        user_id: userId,
      },
    });
  }
}

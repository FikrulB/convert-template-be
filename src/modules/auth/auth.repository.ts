import { hash } from '#/common/utils/encrypt.util';
import { PrismaService } from '#/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async saveRefreshToken(
    userId: number | bigint,
    accessToken: string,
    refreshToken?: string,
  ) {
    const [atHashed, rtHashed] = await Promise.all([
      hash(accessToken),
      hash(refreshToken),
    ]);

    await this.prisma.user_authentication.update({
      where: { user_id: userId },
      data: { access_token: atHashed, refreshToken: rtHashed },
    });
  }
}

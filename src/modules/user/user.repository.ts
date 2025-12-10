import { PrismaService } from '#/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email, deleted_at: null },
      select: {
        unique_code: true,
        email: true,
        created_at: true,
        user_role: {
          where: { role: { deleted_at: null } },
          select: {
            role: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }
}

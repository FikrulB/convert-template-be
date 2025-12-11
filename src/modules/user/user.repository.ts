import { PrismaService } from '#/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  private baseUserSelect = {
    id: true,
    unique_code: true,
    email: true,
    created_at: true,
    user_password_user_password_user_idTouser: {
      where: { deleted_at: null },
      select: { password: true },
      take: 1,
    },
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
    user_detail_user_detail_user_idTouser: {
      where: { deleted_at: null },
      select: {
        avatar: true,
        fullname: true,
        address: true,
        start_at: true,
        end_at: true,
        is_active: true,
      },
    },
  } as const;

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email, deleted_at: null },
      select: this.baseUserSelect,
    });
  }

  async findByUniqueCode(code: string) {
    return this.prisma.user.findUnique({
      where: { unique_code: code, deleted_at: null },
      select: this.baseUserSelect,
    });
  }
}

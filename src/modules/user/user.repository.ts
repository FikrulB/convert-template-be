import { PrismaService } from '#/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from 'generated/prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  private baseUserSelect = {
    id: true,
    unique_code: true,
    email: true,
    start_at: true,
    end_at: true,
    is_active: true,
    created_at: true,
    user_password: {
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
    user_detail: {
      select: {
        avatar: true,
        fullname: true,
        address: true,
      },
    },
  } as const;

  async transaction<T>(cb: (tx: Prisma.TransactionClient) => Promise<T>) {
    return this.prisma.$transaction(cb);
  }

  async findByEmail(email: string) {
    return await this.prisma.users.findFirst({
      where: { email, deleted_at: null },
      select: this.baseUserSelect,
    });
  }

  async findByUniqueCode(code: string) {
    return await this.prisma.users.findUnique({
      where: { unique_code: code, deleted_at: null },
      select: this.baseUserSelect,
    });
  }

  async createUser(
    data: Prisma.usersCreateInput,
    prisma?: PrismaClient | Prisma.TransactionClient,
  ) {
    const prismaTx = prisma ?? this.prisma;
    return await prismaTx.users.create({
      data,
      select: { id: true, unique_code: true },
    });
  }
}

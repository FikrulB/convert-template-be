import { PrismaService } from '#/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async transaction<T>(cb: (tx: Prisma.TransactionClient) => Promise<T>) {
    return this.prisma.$transaction(cb);
  }

  findByEmail<T extends Prisma.usersSelect>(select: T, email: string) {
    return this.prisma.users.findFirst({
      where: {
        email,
        deleted_at: null,
      },
      select: select,
    });
  }

  findByUniqueCode<T extends Prisma.usersSelect>(select: T, code: string) {
    return this.prisma.users.findFirst({
      where: {
        unique_code: code,
        deleted_at: null,
      },
      select: select,
    });
  }

  findActiveAuthUser<T extends Prisma.usersSelect>(
    select: T,
    uniqueCode: string,
  ) {
    const now = new Date();

    return this.prisma.users.findFirst({
      where: {
        unique_code: uniqueCode,
        deleted_at: null,
        is_active: true,
        start_at: { lte: now },
        OR: [{ end_at: null }, { end_at: { gte: now } }],
      },
      select: select,
    });
  }

  async createUser(
    data: Prisma.usersCreateInput,
    prisma?: Prisma.TransactionClient,
  ) {
    const db = prisma ?? this.prisma;

    return await db.users.create({
      data,
      select: {
        id: true,
        unique_code: true,
      },
    });
  }
}

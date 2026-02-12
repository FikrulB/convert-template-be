import { UserProjection } from '#/modules/user/user.projection';
import { PrismaService } from '#/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async transaction<T>(cb: (tx: Prisma.TransactionClient) => Promise<T>) {
    return this.prisma.$transaction(cb);
  }

  findByEmail<T extends Prisma.usersSelect>(email: string, select?: T) {
    return this.prisma.users.findFirst({
      where: {
        email,
        deleted_at: null,
      },
      select: (select ?? UserProjection.base) as T,
    }) as Promise<Prisma.usersGetPayload<{ select: T }>>;
  }

  findByUniqueCode<T extends Prisma.usersSelect>(code: string, select?: T) {
    return this.prisma.users.findFirst({
      where: {
        unique_code: code,
        deleted_at: null,
      },
      select: (select ?? UserProjection.base) as T,
    }) as Promise<Prisma.usersGetPayload<{ select: T }>>;
  }

  findActiveAuthUser<T extends Prisma.usersSelect>(
    uniqueCode: string,
    select?: T,
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
      select: (select ?? UserProjection.base) as T,
    }) as Promise<Prisma.usersGetPayload<{ select: T }>>;
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

import { PrismaService } from '#/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ProfileRepository {
  constructor(private prisma: PrismaService) {}

  async findByUnique(uniqueCode: string) {
    return await this.prisma.users.findUnique({
      where: { unique_code: uniqueCode },
      select: {
        email: true,
        start_at: true,
        end_at: true,
        user_detail: {
          select: {
            avatar: true,
            fullname: true,
            address: true,
            phone_number: true,
          },
        },
      },
    });
  }

  async update(uniqueCode: string, data: Prisma.usersUpdateInput) {
    return await this.prisma.users.update({
      where: { unique_code: uniqueCode },
      data,
    });
  }
}

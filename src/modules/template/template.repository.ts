import { PrismaService } from '#/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from 'generated/prisma/client';

@Injectable()
export class TemplateRepository {
  constructor(private readonly prisma: PrismaService) {}

  transaction<T>(cb: (tx: Prisma.TransactionClient) => Promise<T>) {
    return this.prisma.$transaction(cb);
  }

  findAll<T extends Prisma.excel_templatesSelect>(
    select: T,
    userCode?: string,
  ) {
    return this.prisma.excel_templates.findMany({
      where: { users: { unique_code: userCode } },
      select: select,
    });
  }

  findByCode<T extends Prisma.excel_templatesSelect>(
    select: T,
    code: string,
    userCode?: string,
  ) {
    return this.prisma.excel_templates.findFirst({
      where: {
        code,
        ...(userCode && { users: { unique_code: userCode } }),
      },
      select,
    }) as Promise<Prisma.excel_templatesGetPayload<{ select: T }> | null>;
  }

  findByNameWithUser<T extends Prisma.excel_templatesSelect>(
    select: T,
    name: string,
    userCode: string,
  ) {
    return this.prisma.excel_templates.findFirst({
      where: { name, deleted_at: null, users: { unique_code: userCode } },
      select: select,
    });
  }

  createTemplate(
    data: Prisma.excel_templatesCreateInput,
    prisma?: PrismaClient | Prisma.TransactionClient,
  ) {
    const prismaTx = prisma ?? this.prisma;
    return prismaTx.excel_templates.create({ data });
  }

  async deleteByCode(
    code: string,
    userId: bigint,
    isAdmin: boolean = false,
    prisma?: PrismaClient | Prisma.TransactionClient,
  ) {
    const prismaTx = prisma ?? this.prisma;
    const result = await prismaTx.excel_templates.updateMany({
      where: {
        code,
        deleted_at: null,
        ...(!isAdmin ? {} : { user_id: userId }),
      },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });

    return result.count > 0;
  }

  async updateByCode(
    code: string,
    userId: bigint,
    isAdmin: boolean = false,
    data: Prisma.excel_templatesUpdateInput,
    prisma?: PrismaClient | Prisma.TransactionClient,
  ) {
    const prismaTx = prisma ?? this.prisma;
    const result = await prismaTx.excel_templates.updateMany({
      where: {
        code,
        deleted_at: null,
        ...(!isAdmin ? {} : { user_id: userId }),
      },
      data: {
        ...data,
        updated_at: new Date(),
        updated_by: userId,
      },
    });

    return result.count > 0;
  }
}

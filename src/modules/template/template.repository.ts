import { PrismaService } from '#/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from 'generated/prisma/client';

@Injectable()
export class TemplateRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly templateSelect = {
    code: true,
    name: true,
    description: true,
    data_orientation: true,
    is_multiple_header: true,
    excel_template_detail: {
      select: {
        column_index: true,
        row_index: true,
        label: true,
        is_required: true,
        alignment: true,
        font_color: true,
        background_color: true,
      },
    },
  } satisfies Prisma.excel_templatesSelect;

  transaction<T>(cb: (tx: Prisma.TransactionClient) => Promise<T>) {
    return this.prisma.$transaction(cb);
  }

  findByCode(code: string) {
    return this.prisma.excel_templates.findUnique({
      where: { code },
      select: this.templateSelect,
    });
  }

  findByNameWithUser(name: string, userCode: string) {
    return this.prisma.excel_templates.findFirst({
      where: { name, deleted_at: null, users: { unique_code: userCode } },
      select: this.templateSelect,
    });
  }

  createTemplate(
    data: Prisma.excel_templatesCreateInput,
    prisma?: PrismaClient | Prisma.TransactionClient,
  ) {
    const prismaTx = prisma ?? this.prisma;
    return prismaTx.excel_templates.create({ data });
  }
}

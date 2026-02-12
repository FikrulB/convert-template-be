import { PrismaService } from '#/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

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

  findByCode(code: string) {
    return this.prisma.excel_templates.findUnique({
      where: { code },
      select: this.templateSelect,
    });
  }

  findByNameWithUser(name: string, userId: bigint) {
    return this.prisma.excel_templates.findFirst({
      where: { name, user_id: userId },
      select: this.templateSelect,
    });
  }

  createTemplate(data: Prisma.excel_templatesCreateInput) {
    return this.prisma.excel_templates.create({ data });
  }
}

import { PrismaService } from '#/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExcelMappingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findTemplate() {}
}

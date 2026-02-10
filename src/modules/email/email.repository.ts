import { PrismaService } from '#/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailRepository {
  constructor(private prisma: PrismaService) {}
}

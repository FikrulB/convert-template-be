import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    super({ adapter, log: ['warn', 'error'], errorFormat: 'pretty' });

    this.$on('query' as any, (e: Prisma.QueryEvent) => {
      console.info(`Duration: ${e.duration} ms`);
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      await this.$queryRaw`SELECT 1`; // test connection
      console.log('✅ Prisma connected to database successfully!');
    } catch (err) {
      console.error('❌ Prisma failed to connect to database', err);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  console.log('\n🌱 Start database seeding...\n');

  // Seeding Role
  try {
    console.log('🚀 Seeding Role...');
    await prisma.role.createMany({
      data: [
        { code: 'ADM', name: 'Administrator' },
        { code: 'USR', name: 'User' },
      ],
      skipDuplicates: true,
    });
    console.log('✔️ Role seeded\n');
  } catch (err) {
    console.error('❌ Failed seeding Role:', err);
  }

  console.log('✨ All seeding tasks are completed!\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

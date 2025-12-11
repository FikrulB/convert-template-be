import { makeRandomString } from '#/common/utils/common.util';
import dayJs from '#/common/utils/dayjs.util';
import { hash } from '#/common/utils/encrypt.util';
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

    console.log('🚀 Seeding User...');
    const uniqueCode = makeRandomString({
      length: 30,
      isNumeric: true,
      isUpperCase: true,
      isLowerCase: false,
      isSpecialChar: false,
    });

    const password = await hash(process.env.SEED_USER_PASSWORD);

    const adminRole = await prisma.role.findFirst({
      where: { code: 'ADM' },
      select: { id: true },
    });

    await prisma.user.create({
      data: {
        unique_code: uniqueCode,
        email: 'mfikrulb@gmail.com',
        user_detail_user_detail_user_idTouser: {
          create: {
            fullname: 'M Fikrul Bachtiar',
            start_at: dayJs().utc().toDate(),
            is_active: true,
          },
        },
        user_password_user_password_user_idTouser: {
          create: { password },
        },
        user_role: {
          create: { role_id: adminRole.id },
        },
      },
    });
    console.log('✔️ User seeded\n');
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

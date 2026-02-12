import { makeRandomString } from '#/common/utils/common.util';
import dayJs from '#/common/utils/dayjs.util';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
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

    const password = await bcrypt.hash(
      process.env.SEED_USER_PASSWORD,
      Number(process.env.SALT_ROUND),
    );

    const adminRole = await prisma.role.findFirst({
      where: { code: 'ADM' },
      select: { id: true },
    });

    const superAdmin = await prisma.users.findFirst({
      where: { email: 'mfikrulb@gmail.com' },
      select: { id: true },
    });

    if (!superAdmin)
      await prisma.users.create({
        data: {
          unique_code: uniqueCode,
          email: 'mfikrulb@gmail.com',
          start_at: dayJs().utc().toDate(),
          is_active: true,
          user_detail: {
            create: {
              fullname: 'M Fikrul Bachtiar',
            },
          },
          user_password: {
            create: { password },
          },
          user_role: {
            create: { role_id: adminRole.id },
          },
        },
      });
    console.log('✔️ User seeded\n');

    console.log('🚀 Seeding Mapping Type...');
    await prisma.mapping_type.createMany({
      data: [
        {
          code: 'STA',
          name: 'Static',
          description:
            'Nilai target selalu tetap (hardcoded), tidak tergantung isi Excel',
        },
        {
          code: 'DYN',
          name: 'Dynamic',
          description: 'Nilai target diambil langsung dari sel Excel tertentu',
        },
        {
          code: 'FRM',
          name: 'Formula',
          description:
            'Nilai target dihasilkan dari perhitungan / manipulasi data',
        },
      ],
      skipDuplicates: true,
    });
    console.log('✔️ Mapping Type seeded\n');
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

import { ExcelMappingsModule } from './modules/excel-mappings/excel-mappings.module';
import { EmailModule } from './modules/email/email.module';
import { HashService } from '#/common/utils/encrypt.util';
import { AuthModule } from '#/modules/auth/auth.module';
import { ExcelModule } from '#/modules/excel/excel.module';
import { TemplatesModule } from '#/modules/template/template.module';
import { PrismaModule } from '#/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from '#/modules/profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    TemplatesModule,
    ExcelModule,
    UserModule,
    AuthModule,
    ProfileModule,
    EmailModule,
    ExcelMappingsModule,
  ],
  providers: [HashService],
  exports: [HashService],
})
export class AppModule {}

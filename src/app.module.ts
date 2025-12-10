import { AuthModule } from '#/modules/auth/auth.module';
import { ExcelModule } from '#/modules/excel/excel.module';
import { TemplatesModule } from '#/modules/template/template.module';
import { PrismaModule } from '#/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    TemplatesModule,
    ExcelModule,
    UserModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}

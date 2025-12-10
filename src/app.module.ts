import { AuthModule } from '#/modules/auth/auth.module';
import { ExcelModule } from '#/modules/excel/excel.module';
import { TemplatesModule } from '#/modules/template/template.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [TemplatesModule, ExcelModule, AuthModule],
})
export class AppModule {}

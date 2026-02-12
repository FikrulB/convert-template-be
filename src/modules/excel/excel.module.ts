import { ExcelController } from '#/modules/excel/excel.controller';
import { ExcelService } from '#/modules/excel/excel.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ExcelController],
  providers: [ExcelService],
})
export class ExcelModule {}

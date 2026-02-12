import { Module } from '@nestjs/common';
import { ExcelMappingsController } from './excel-mappings.controller';
import { ExcelMappingsService } from './excel-mappings.service';
import { ExcelMappingsRepository } from './excel-mappings.repository';

@Module({
  controllers: [ExcelMappingsController],
  providers: [ExcelMappingsService, ExcelMappingsRepository],
  exports: [ExcelMappingsService],
})
export class ExcelMappingsModule {}

import { Controller, HttpCode, Post, Req } from '@nestjs/common';
import { ExcelMappingsService } from './excel-mappings.service';
import { Request } from 'express';
import { ExcelMappingsDTO } from '#/modules/excel-mappings/excel-mappings.dto';

@Controller('excel-mappings')
export class ExcelMappingsController {
  constructor(private readonly excelMappingsService: ExcelMappingsService) {}

  @Post()
  @HttpCode(200)
  async create(@Req() req: Request, body: ExcelMappingsDTO) {
    return await this.excelMappingsService.create(req.auth, body);
  }
}

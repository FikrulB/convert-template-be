import { Injectable } from '@nestjs/common';
import { ExcelMappingsRepository } from './excel-mappings.repository';
import { TUserPayload } from '#/common/types/user-payload.type';
import { ExcelMappingsDTO } from '#/modules/excel-mappings/excel-mappings.dto';

@Injectable()
export class ExcelMappingsService {
  constructor(
    private readonly excelMappingsRepository: ExcelMappingsRepository,
  ) {}

  async create(user: TUserPayload, payload: ExcelMappingsDTO) {
    const template = await this.excelMappingsRepository.findTemplate();

    return template;
  }
}

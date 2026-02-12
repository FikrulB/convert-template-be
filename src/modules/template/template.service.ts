import { TUserPayload } from '#/common/types/user-payload.type';
import { EDataOrientation, TemplateDTO } from '#/modules/template/template.dto';
import { TemplateRepository } from '#/modules/template/template.repository';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class TemplateService {
  constructor(private readonly templateRepository: TemplateRepository) {}

  async create(user: TUserPayload, payload: TemplateDTO) {
    const { name, description, dataOrientation, isMultipleHeader, details } =
      payload;

    const positionSet = new Set<string>();
    const rowIndexSet = new Set<number>();
    const columnIndexSet = new Set<number>();
    const labelSet = new Set<string>();

    for (const detail of details) {
      const key = `${detail.rowIndex}-${detail.columnIndex}`;

      if (positionSet.has(key))
        throw new BadRequestException(
          `Duplicate cell position di row ${detail.rowIndex}, column ${detail.columnIndex}`,
        );

      positionSet.add(key);
      rowIndexSet.add(detail.rowIndex);
      columnIndexSet.add(detail.columnIndex);

      if (!detail.label || detail.label.trim() === '')
        throw new BadRequestException('Label tidak boleh kosong');

      if (labelSet.has(detail.label))
        throw new BadRequestException(
          `Duplicate label "${detail.label}" ditemukan pada template`,
        );

      labelSet.add(detail.label);
    }

    const headerIndexes =
      dataOrientation === EDataOrientation.VERTICAL
        ? Array.from(rowIndexSet)
        : Array.from(columnIndexSet);

    headerIndexes.sort((a, b) => a - b);

    if (isMultipleHeader) {
      if (headerIndexes.length < 2)
        throw new BadRequestException(
          'Multiple header aktif, tapi hanya ada 1 header',
        );

      for (let i = 1; i < headerIndexes.length; i++) {
        if (headerIndexes[i] !== headerIndexes[i - 1] + 1)
          throw new BadRequestException('Header harus berurutan tanpa gap');
      }
    } else {
      if (headerIndexes.length !== 1)
        throw new BadRequestException(
          'Template tidak boleh memiliki lebih dari 1 header',
        );
    }

    // const duplicateNameTemplate = await this.

    // await this.templateRepository.createTemplate({
    //   name,
    //   data_orientation: dataOrientation,
    //   code: '',
    // });

    return payload;
  }
}

import { ERole } from '#/common/enums/role.enum';
import { TUserPayload } from '#/common/types/user-payload.type';
import { makeRandomString } from '#/common/utils/common.util';
import {
  CodeParamDTO,
  EDataOrientation,
  TemplateDTO,
} from '#/modules/template/template.dto';
import { TemplateProjection } from '#/modules/template/template.projection';
import { TemplateRepository } from '#/modules/template/template.repository';
import { UserProjection } from '#/modules/user/user.projection';
import { UserRepository } from '#/modules/user/user.repository';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class TemplateService {
  constructor(
    private readonly templateRepository: TemplateRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(user: TUserPayload, payload: TemplateDTO) {
    const {
      name,
      description,
      dataOrientation,
      isMultipleHeader,
      headersSetting,
      details,
    } = payload;

    if (!details.length)
      throw new BadRequestException(
        'Template harus memiliki minimal satu header.',
      );

    if (isMultipleHeader && !headersSetting)
      throw new BadRequestException(
        'Kolom penanda dokumen wajib diisi ketika menggunakan multiple header.',
      );

    let isGroupingKeyExist: boolean = true;
    const positionSet = new Set<string>();
    const rowIndexSet = new Set<number>();
    const columnIndexSet = new Set<number>();
    // const labelSet = new Set<string>();

    for (const detail of details) {
      if (detail.rowIndex < 0 || detail.columnIndex < 0)
        throw new BadRequestException('Posisi baris dan kolom tidak valid.');

      const key = `${detail.rowIndex}-${detail.columnIndex}`;

      if (positionSet.has(key))
        throw new BadRequestException(
          `Terdapat posisi sel yang sama pada baris ${detail.rowIndex} dan kolom ${detail.columnIndex}.`,
        );

      positionSet.add(key);
      rowIndexSet.add(detail.rowIndex);
      columnIndexSet.add(detail.columnIndex);

      const normalizedLabel = detail.label.trim().toLowerCase();
      const normalizedGroupingColumnLabel = headersSetting.groupingColumnLabel
        .trim()
        .toLowerCase();

      if (
        isGroupingKeyExist &&
        normalizedGroupingColumnLabel === normalizedLabel
      )
        throw new BadRequestException(
          'Kolom penanda dokumen tidak boleh digunakan lebih dari satu kali. Silakan pilih kolom yang berbeda.',
        );

      if (normalizedGroupingColumnLabel === normalizedLabel)
        isGroupingKeyExist = true;

      //? LABEL apakah boleh ada yang sama? masih dipertanyakan
      // if (!normalizedLabel)
      //   throw new BadRequestException('Label header wajib diisi.');

      // if (labelSet.has(normalizedLabel))
      //   throw new BadRequestException(
      //     `Label "${detail.label}" sudah digunakan dalam template ini.`,
      //   );

      // labelSet.add(normalizedLabel);
    }

    const headerIndexes =
      dataOrientation === EDataOrientation.VERTICAL
        ? Array.from(rowIndexSet)
        : Array.from(columnIndexSet);

    headerIndexes.sort((a, b) => a - b);

    if (isMultipleHeader) {
      if (headerIndexes.length < 2)
        throw new BadRequestException(
          'Minimal harus terdapat dua header saat multiple header diaktifkan.',
        );

      for (let i = 1; i < headerIndexes.length; i++) {
        if (headerIndexes[i] !== headerIndexes[i - 1] + 1)
          throw new BadRequestException(
            'Header harus disusun berurutan tanpa jeda.',
          );
      }

      if (headerIndexes.length !== Object.keys(headersSetting.headers).length)
        throw new BadRequestException(
          'Jumlah header yang diatur pada pengaturan tidak sesuai dengan jumlah header yang dibuat pada template. Pastikan keduanya sama.',
        );
    } else {
      if (headerIndexes.length !== 1)
        throw new BadRequestException(
          'Template hanya boleh memiliki satu header.',
        );
    }

    if (!isGroupingKeyExist)
      throw new BadRequestException(
        'Kolom penanda dokumen yang dipilih tidak ditemukan pada template. Pastikan kolom tersebut sudah dimapping dengan benar.',
      );

    const randomString = makeRandomString({
      length: 50,
      isLowerCase: false,
      isUpperCase: true,
      isNumeric: true,
    });

    await this.templateRepository.transaction(async (trx) => {
      const nameIsExist = await this.templateRepository.findByNameWithUser(
        TemplateProjection.base,
        name,
        user.sub,
      );

      if (nameIsExist)
        throw new ConflictException(
          'Nama template sudah digunakan. Silakan gunakan nama lain.',
        );

      return await this.templateRepository.createTemplate(
        {
          name,
          description,
          data_orientation: dataOrientation,
          is_multiple_header: isMultipleHeader,
          code: randomString,
          users: {
            connect: { unique_code: user.sub },
          },
          excel_template_detail: {
            createMany: {
              data: details.map((d) => ({
                column_index: d.columnIndex,
                row_index: d.rowIndex,
                label: d.label,
                is_required: d.isRequired,
                alignment: d.alignment
                  ? {
                      vertical: d.alignment.vertical,
                      horizontal: d.alignment.horizontal,
                    }
                  : null,
                font_color: d.fontColor,
                background_color: d.backgroundColor,
              })),
            },
          },
        },
        trx,
      );
    });

    return null;
  }

  async read(user: TUserPayload, param: CodeParamDTO) {
    const isAdmin = user.role === ERole.ADM;
    const template = await this.templateRepository.findByCode(
      TemplateProjection.base,
      param.code,
      isAdmin ? undefined : user.sub,
    );

    if (!template)
      throw new NotFoundException('Template yang Anda cari tidak ditemukan.');
    return template;
  }

  async readAll(user: TUserPayload) {
    const isAdmin = user.role === ERole.ADM;
    return await this.templateRepository.findAll(
      TemplateProjection.base,
      isAdmin ? undefined : user.sub,
    );
  }

  update(user: TUserPayload, payload: TemplateDTO, param: CodeParamDTO) {
    const isAdmin = user.role === ERole.ADM;

    return true;
  }

  async delete(user: TUserPayload, param: CodeParamDTO) {
    const isAdmin = user.role === ERole.ADM;

    const userInfo = await this.userRepository.findByUniqueCode(
      UserProjection.base,
      user.sub,
    );

    if (!userInfo) throw new UnauthorizedException('User tidak valid.');

    const deleted = await this.templateRepository.deleteByCode(
      param.code,
      userInfo.id,
      isAdmin,
    );

    if (!deleted)
      throw new NotFoundException('Template yang Anda cari tidak ditemukan.');

    return null;
  }
}

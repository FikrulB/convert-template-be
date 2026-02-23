import { ERole } from '#/common/enums/role.enum';
import { TUserPayload } from '#/common/types/user-payload.type';
import { makeRandomString } from '#/common/utils/common.util';
import {
  CodeParamDTO,
  DataOrienTationMapper,
  EDataOrientation,
  TemplateDTO,
  UpdateTemplateDTO,
} from '#/modules/template/template.dto';
import {
  IHeaderSetting,
  ITemplateDetail,
} from '#/modules/template/template.interface';
import {
  TemplateProjection,
  TTemplateDetail,
  TTemplateSelectFullInfo,
} from '#/modules/template/template.projection';
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
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class TemplateService {
  constructor(
    private readonly templateRepository: TemplateRepository,
    private readonly userRepository: UserRepository,
  ) {}

  read(user: TUserPayload, param: CodeParamDTO) {
    return this.getTemplateOrThrow(user, param.code);
  }

  readAll(user: TUserPayload) {
    const isAdmin = user.role === ERole.ADM;
    return this.templateRepository.findAll(
      TemplateProjection.base,
      isAdmin ? undefined : user.sub,
    );
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

  async create(user: TUserPayload, payload: TemplateDTO) {
    this.validateTemplateStructure(payload);

    const code = makeRandomString({
      length: 50,
      isLowerCase: false,
      isUpperCase: true,
      isNumeric: true,
    });

    await this.ensureTemplateNameUnique(payload.name, user.sub);
    await this.templateRepository.createTemplate(
      this.mapCreatePayload(payload, user.sub, code),
    );

    return null;
  }

  async update(
    user: TUserPayload,
    payload: UpdateTemplateDTO,
    param: CodeParamDTO,
  ) {
    const isAdmin = user.role === ERole.ADM;
    const template = await this.getTemplateOrThrow(user, param.code);

    this.validateUpdateStructure(template, payload);

    const diff = payload.details
      ? this.buildDiff(template.excel_template_detail, payload.details)
      : null;

    return this.templateRepository.updateByCode(
      param.code,
      template.users.id,
      isAdmin,
      {
        name: payload.name,
        description: payload.description,
        data_orientation: payload.dataOrientation,
        is_multiple_header: payload.isMultipleHeader,
        excel_template_detail: {
          updateMany: diff.toUpdate.map((item) => ({
            where: { column_index: item.columnIndex, row_index: item.rowIndex },
            data: {
              label: item.label,
              is_required: item.isRequired,
              alignment: item.alignment
                ? {
                    vertical: item.alignment.vertical,
                    horizontal: item.alignment.horizontal,
                  }
                : null,
              font_color: item.fontColor,
              background_color: item.backgroundColor,
            },
          })),
        },
      },
    );
  }

  private async getTemplateOrThrow(user: TUserPayload, code: string) {
    const isAdmin = user.role === ERole.ADM;

    const template = await this.templateRepository.findByCode(
      TemplateProjection.full,
      code,
      isAdmin ? undefined : user.sub,
    );

    if (!template)
      throw new NotFoundException('Template yang Anda cari tidak ditemukan.');

    return template;
  }

  private async ensureTemplateNameUnique(name: string, userCode: string) {
    const exist = await this.templateRepository.findByNameWithUser(
      TemplateProjection.base,
      name,
      userCode,
    );

    if (exist)
      throw new ConflictException(
        'Nama template sudah digunakan. Silakan gunakan nama lain.',
      );
  }

  private validateTemplateStructure(payload: TemplateDTO) {
    const { dataOrientation, isMultipleHeader, headersSetting, details } =
      payload;

    if (!details || details.length === 0)
      throw new BadRequestException(
        'Template harus memiliki minimal satu header.',
      );

    this.validateStructure(
      dataOrientation,
      isMultipleHeader,
      headersSetting,
      details,
      null,
    );
  }

  private validateUpdateStructure(
    template: TTemplateSelectFullInfo,
    payload: UpdateTemplateDTO,
  ) {
    if (
      template.is_multiple_header === false &&
      payload.isMultipleHeader === true &&
      !payload.headersSetting
    )
      throw new BadRequestException(
        'Kolom penanda dokumen wajib diisi ketika menggunakan multiple header.',
      );

    if (!payload.details) return;

    const orientation =
      payload.dataOrientation ??
      DataOrienTationMapper.fromPrisma(template.data_orientation);

    const isMultiple = payload.isMultipleHeader ?? template.is_multiple_header;

    this.validateStructure(
      orientation,
      isMultiple,
      payload.headersSetting,
      payload.details,
      template,
    );
  }

  private validateStructure(
    orientation: EDataOrientation,
    isMultipleHeader: boolean,
    headersSetting: IHeaderSetting | undefined,
    details: ITemplateDetail[],
    template: TTemplateSelectFullInfo | null,
  ) {
    if (
      template?.is_multiple_header === false &&
      isMultipleHeader === true &&
      !headersSetting
    )
      throw new BadRequestException(
        'Kolom penanda dokumen wajib diisi ketika menggunakan multiple header.',
      );

    const { rowIndexes, columnIndexes } = this.validateDetailPositions(
      details,
      headersSetting,
      isMultipleHeader,
      template,
    );

    this.validateHeaderIndexes(
      orientation,
      isMultipleHeader,
      headersSetting,
      rowIndexes,
      columnIndexes,
      template,
    );
  }

  private validateDetailPositions(
    details: ITemplateDetail[],
    headersSetting?: IHeaderSetting,
    isMultipleHeader?: boolean,
    template?: TTemplateSelectFullInfo | null,
  ) {
    const positionSet = new Set<string>();
    const rowIndexes = new Set<number>();
    const columnIndexes = new Set<number>();
    let groupingFound = false;

    const groupingLabel = headersSetting?.groupingColumnLabel
      ?.trim()
      .toLowerCase();

    for (const detail of details) {
      if (detail.rowIndex < 0 || detail.columnIndex < 0)
        throw new BadRequestException('Posisi baris dan kolom tidak valid.');

      const key = `${detail.rowIndex}-${detail.columnIndex}`;

      if (positionSet.has(key))
        throw new BadRequestException(
          `Terdapat posisi sel yang sama pada baris ${detail.rowIndex} dan kolom ${detail.columnIndex}.`,
        );

      positionSet.add(key);
      rowIndexes.add(detail.rowIndex);
      columnIndexes.add(detail.columnIndex);

      if (groupingLabel) {
        const label = detail.label.trim().toLowerCase();
        if (label === groupingLabel) {
          if (groupingFound)
            throw new BadRequestException(
              'Kolom penanda dokumen tidak boleh digunakan lebih dari satu kali.',
            );
          groupingFound = true;
        }
      }
    }

    if (
      template?.is_multiple_header === false &&
      isMultipleHeader === true &&
      !groupingFound
    )
      throw new BadRequestException(
        'Kolom penanda dokumen tidak ditemukan pada template.',
      );

    return { rowIndexes, columnIndexes };
  }

  private validateHeaderIndexes(
    orientation: EDataOrientation,
    isMultipleHeader: boolean,
    headersSetting: IHeaderSetting | undefined,
    rowIndexes: Set<number>,
    columnIndexes: Set<number>,
    template: TTemplateSelectFullInfo | null,
  ) {
    const indexes =
      orientation === EDataOrientation.VERTICAL
        ? Array.from(rowIndexes)
        : Array.from(columnIndexes);

    indexes.sort((a, b) => a - b);

    if (isMultipleHeader) {
      if (indexes.length < 2)
        throw new BadRequestException(
          'Minimal harus terdapat dua header saat multiple header diaktifkan.',
        );

      for (let i = 1; i < indexes.length; i++) {
        if (indexes[i] !== indexes[i - 1] + 1)
          throw new BadRequestException(
            'Header harus disusun berurutan tanpa jeda.',
          );
      }

      let headersCount: number;

      if (headersSetting) {
        headersCount = Object.keys(headersSetting.headers ?? {}).length;
      } else {
        const head =
          template?.excel_template_header_settings?.excel_template_header ?? [];

        headersCount = head.length;
      }

      if (indexes.length !== headersCount)
        throw new BadRequestException(
          'Jumlah header tidak sesuai dengan pengaturan.',
        );
    } else {
      if (indexes.length !== 1)
        throw new BadRequestException(
          'Template hanya boleh memiliki satu header.',
        );
    }
  }

  private mapCreatePayload(
    payload: TemplateDTO,
    userCode: string,
    code: string,
  ): Prisma.excel_templatesCreateInput {
    return {
      name: payload.name,
      description: payload.description,
      data_orientation: payload.dataOrientation,
      is_multiple_header: payload.isMultipleHeader,
      code,
      users: {
        connect: { unique_code: userCode },
      },
      excel_template_header_settings: {
        create: {
          grouping_column_label: payload.headersSetting.groupingColumnLabel,
          excel_template_header: {
            createMany: {
              data: Object.entries(payload.headersSetting.headers).map(
                ([key, val]) => ({
                  header_index: key,
                  is_multiple: val.isMultiple,
                }),
              ),
            },
          },
        },
      },
      excel_template_detail: {
        createMany: {
          data: payload.details.map((d) => ({
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
    };
  }

  private buildDiff(
    existingDetails: TTemplateDetail[],
    incomingDetails: ITemplateDetail[],
  ) {
    const existingMap = new Map(
      existingDetails.map((d) => [`${d.row_index}-${d.column_index}`, d]),
    );

    const toUpdate: ITemplateDetail[] = [];
    const toCreate: ITemplateDetail[] = [];
    const toDelete: number[] = [];

    const incomingKeys = new Set<string>();

    for (const detail of incomingDetails) {
      const key = `${detail.rowIndex}-${detail.columnIndex}`;
      incomingKeys.add(key);

      const existing = existingMap.get(key);

      if (existing) {
        toUpdate.push(detail);
      } else {
        toCreate.push(detail);
      }
    }

    for (const existing of existingDetails) {
      const key = `${existing.row_index}-${existing.column_index}`;
      if (!incomingKeys.has(key)) toDelete.push(Number(existing.id));
    }

    return {
      toCreate,
      toUpdate,
      toDelete,
    };
  }
}

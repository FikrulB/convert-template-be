import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum EMappingType {
  STATIC = 'STA',
  DYNAMIC = 'DYN',
  FORMULA = 'FRM',
}

export class ExcelMappingsDTO {
  @IsNotEmpty({ message: 'Nama mapping wajib diisi.' })
  @IsString({ message: 'Nama mapping harus berupa teks.' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Deskripsi harus berupa teks.' })
  description?: string;

  @IsNotEmpty({ message: 'Kode template wajib diisi.' })
  @IsString({ message: 'Kode template harus berupa teks.' })
  templateCode: string;

  @IsArray({ message: 'Detail mapping harus berupa array.' })
  @ArrayMinSize(1, {
    message: 'Minimal harus ada 1 detail mapping.',
  })
  @ValidateNested({ each: true })
  @Type(() => DetailMapping)
  detailMap: DetailMapping[];
}

export class DetailMapping {
  @IsNotEmpty({ message: 'Source address wajib diisi.' })
  @IsString({ message: 'Source address harus berupa teks.' })
  sourceAddress: string;

  @IsNotEmpty({ message: 'Source label wajib diisi.' })
  @IsString({ message: 'Source label harus berupa teks.' })
  sourceLabel: string;

  @IsNotEmpty({ message: 'Target address wajib diisi.' })
  @IsString({ message: 'Target address harus berupa teks.' })
  targetAddress: string;

  @IsNotEmpty({ message: 'Tipe mapping wajib diisi.' })
  @IsEnum(EMappingType, {
    message:
      'Tipe mapping tidak valid. Gunakan salah satu: STA, DYN, atau FRM.',
  })
  mappingType: EMappingType;

  @IsOptional()
  @IsString({ message: 'Value harus berupa teks.' })
  value?: string;
}

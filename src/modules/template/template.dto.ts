import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  ValidateNested,
  IsHexColor,
  Min,
  ArrayMinSize,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ToBoolean } from '#/common/utils/dto.util';
import { createEnumMapper } from '#/common/utils/common.util';

export enum EDataOrientation {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL',
}

export enum EVerticalAlignment {
  TOP = 'top',
  MIDDLE = 'middle',
  BOTTOM = 'bottom',
}

export enum EHorizontalAlignment {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

export const DataOrienTationMapper = createEnumMapper({
  [EDataOrientation.VERTICAL]: 'VERTICAL',
  [EDataOrientation.HORIZONTAL]: 'HORIZONTAL',
});

export class AlignmentCellDTO {
  @IsOptional()
  @IsEnum(EVerticalAlignment, {
    message: 'Vertical alignment harus top, middle, atau bottom.',
  })
  vertical?: EVerticalAlignment;

  @IsOptional()
  @IsEnum(EHorizontalAlignment, {
    message: 'Horizontal alignment harus left, center, atau right.',
  })
  horizontal?: EHorizontalAlignment;
}

export class TemplateDetailDTO {
  @IsNotEmpty({ message: 'Column index tidak boleh kosong.' })
  @IsNumber({}, { message: 'Column index harus berupa angka.' })
  @Min(0, { message: 'Column index tidak boleh kurang dari 0.' })
  columnIndex: number;

  @IsNotEmpty({ message: 'Row index tidak boleh kosong.' })
  @IsNumber({}, { message: 'Row index harus berupa angka.' })
  @Min(0, { message: 'Row index tidak boleh kurang dari 0.' })
  rowIndex: number;

  @IsNotEmpty({ message: 'Label tidak boleh kosong.' })
  @IsString({ message: 'Label harus berupa string.' })
  label: string;

  @ToBoolean()
  @IsBoolean({ message: 'IsRequired harus berupa boolean (true/false).' })
  isRequired: boolean = false;

  @IsOptional()
  @ValidateNested()
  @Type(() => AlignmentCellDTO)
  alignment?: AlignmentCellDTO;

  @IsOptional()
  @IsHexColor({
    message: 'Font color harus berupa format HEX yang valid (contoh: #FFFFFF).',
  })
  fontColor?: string;

  @IsOptional()
  @IsHexColor({
    message:
      'Background color harus berupa format HEX yang valid (contoh: #000000).',
  })
  backgroundColor?: string;
}

export class TemplateDTO {
  @IsNotEmpty({ message: 'Name tidak boleh kosong.' })
  @IsString({ message: 'Name harus berupa string.' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description harus berupa string.' })
  description?: string;

  @IsNotEmpty({ message: 'Data orientation tidak boleh kosong.' })
  @IsEnum(EDataOrientation, {
    message: 'Data orientation harus bernilai VERTICAL atau HORIZONTAL.',
  })
  dataOrientation: EDataOrientation;

  @ToBoolean()
  @IsBoolean({ message: 'isMultipleHeader harus berupa boolean (true/false).' })
  isMultipleHeader: boolean = false;

  @IsArray({ message: 'Detail template harus berupa array.' })
  @ArrayMinSize(1, {
    message: 'Minimal harus ada 1 detail mapping.',
  })
  @ValidateNested({ each: true })
  @Type(() => TemplateDetailDTO)
  details: TemplateDetailDTO[];
}

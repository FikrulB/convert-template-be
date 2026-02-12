import { ToNumber } from '#/common/utils/dto.util';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class DConvertToJSON {
  @IsNotEmpty({ message: 'File ID tidak boleh kosong' })
  @IsUUID('4', { message: 'File ID tidak valid' })
  fileID: string;

  @IsOptional()
  @ToNumber()
  @IsNumber({}, { message: 'Header Row wajib berupa angka' })
  headerRow?: number = 1;

  @IsOptional()
  @IsString({ message: 'SheetName wajib berupa teks' })
  sheetName?: string;
}

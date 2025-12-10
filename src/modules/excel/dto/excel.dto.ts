import { ToNumber } from '#/common/utils/dto.util';
import { IsNumber, IsOptional } from 'class-validator';

export class DConvertToJSON {
  @IsOptional()
  @ToNumber()
  @IsNumber()
  headerRow?: number = 1;
}

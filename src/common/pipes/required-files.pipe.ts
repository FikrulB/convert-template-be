import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class AnyFileRequiredPipe implements PipeTransform {
  transform(value: Express.Multer.File): Express.Multer.File;
  transform(value: Express.Multer.File[]): Express.Multer.File[];
  transform(value: any): any {
    if (!value || (Array.isArray(value) && value.length === 0))
      throw new BadRequestException(
        'Tidak ada file yang dikirim. Pastikan Anda mengirim file',
      );
    return value;
  }
}

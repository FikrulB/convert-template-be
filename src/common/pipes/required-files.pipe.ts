import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class AnyFileRequiredPipe implements PipeTransform {
  transform(
    value: Express.Multer.File | Express.Multer.File[],
  ): Express.Multer.File | Express.Multer.File[] {
    if (!value)
      throw new BadRequestException(
        'Tidak ada file yang dikirim. Pastikan Anda mengirim file',
      );

    if (Array.isArray(value) && value.length === 0)
      throw new BadRequestException(
        'Tidak ada file yang dikirim. Pastikan Anda mengirim file',
      );

    return value;
  }
}

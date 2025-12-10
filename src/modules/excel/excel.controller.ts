import { AnyFileRequiredPipe } from '#/common/pipes/required-files.pipe';
import { DConvertToJSON } from '#/modules/excel/dto/excel.dto';
import { ExcelService } from '#/modules/excel/excel.service';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';

@Controller('excel')
@UsePipes(new ValidationPipe({ transform: true }))
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post('/convert')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { files: 1, fileSize: 5 * 1024 * 1024 },
    }),
  )
  async convertToJson(
    @Req() req: Request,
    @UploadedFile(AnyFileRequiredPipe) file: Express.Multer.File,
    @Body() body: DConvertToJSON,
  ) {
    const tmpFilePath = file.originalname;
    fs.writeFileSync(tmpFilePath, file.buffer);

    return await this.excelService.convertToJson(req, file, body);
  }
}

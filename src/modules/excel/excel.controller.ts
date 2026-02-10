import { JwtAuthGuard } from '#/common/guards/jwt.guard';
import { AnyFileRequiredPipe } from '#/common/pipes/required-files.pipe';
import { DConvertToJSON } from '#/modules/excel/dto/excel.dto';
import { ExcelService } from '#/modules/excel/excel.service';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('excel')
@UseGuards(JwtAuthGuard)
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post('/convert')
  @HttpCode(200)
  async convertToJson(@Req() req: Request, @Body() body: DConvertToJSON) {
    return await this.excelService.convertToJson(req.auth, body);
  }

  @Post('/inspect')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './tmp/excel-import',
        filename: (req, file, cb) => {
          const fileID = uuidv4();
          const ext = path.extname(file.originalname);
          cb(null, `${fileID}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          !file.mimetype.includes(
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          )
        ) {
          return cb(new BadRequestException('Tipe file tidak valid!'), false);
        }
        cb(null, true);
      },
      limits: { files: 1, fileSize: 5 * 1024 * 1024 },
    }),
  )
  async inspectExcel(
    @Req() req: Request,
    @UploadedFile(AnyFileRequiredPipe) file: Express.Multer.File,
  ) {
    const fileID = path.parse(file.filename).name;
    return await this.excelService.getWorksheetInfo(
      req.auth,
      file.path,
      fileID,
    );
  }
}

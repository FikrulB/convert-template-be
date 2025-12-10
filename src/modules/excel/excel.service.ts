import { IExcelJSON } from '#/common/interfaces/excel.interface';
import { DConvertToJSON } from '#/modules/excel/dto/excel.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';

@Injectable()
export class ExcelService {
  async convertToJson(
    req: Request,
    file: Express.Multer.File,
    body: DConvertToJSON,
  ) {
    const { headerRow } = body;
    const workbook = new ExcelJS.Workbook();
    const nameFile = file.originalname;

    const results: IExcelJSON = { headers: [], items: [] };

    try {
      fs.writeFileSync(nameFile, file.buffer);
      await workbook.xlsx.readFile(nameFile);

      const worksheet = workbook.getWorksheet(1);
      const rowCount = worksheet?.actualRowCount;

      for (let i = 1; i <= rowCount; i++) {
        const row = worksheet.getRow(i);

        row.eachCell((cell, colNumber) => {
          const colLetter = cell.address.replace(/[0-9]/g, '');
          const address = cell.address;

          const value: string =
            typeof cell.value === 'object' &&
            cell.value !== null &&
            'text' in cell.value
              ? (cell.value as any).text
              : (cell.value ?? '');

          let bgColor: string | null = null;
          const fill = cell.fill as ExcelJS.FillPattern | undefined;

          if (fill?.type === 'pattern' && fill.fgColor?.argb) {
            bgColor = `#${fill.fgColor.argb}`;
          }

          const keyResult = i <= headerRow ? 'headers' : 'items';

          results[keyResult].push({
            address,
            colLetter,
            colNumber,
            value,
            bgColor,
          });
        });
      }
    } finally {
      fs.unlinkSync(nameFile);
    }

    return {
      code: HttpStatus.OK,
      message: 'Success',
      data: results,
    };
  }
}

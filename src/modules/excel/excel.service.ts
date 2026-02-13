import { IItemExcel } from '#/modules/excel/excel.interface';
import { TUserPayload } from '#/common/types/user-payload.type';
import { DConvertToJSON } from '#/modules/excel/excel.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import path from 'path';

@Injectable()
export class ExcelService {
  private basePath = path.resolve('./tmp/excel-import');

  async getWorksheetInfo(user: TUserPayload, filePath: string, fileID: string) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    return {
      fileID,
      count: workbook.worksheets.length,
      names: workbook.worksheets.map((ws) => ws.name),
    };
  }

  async convertToJson(user: TUserPayload, payload: DConvertToJSON) {
    const { fileID, sheetName } = payload;
    const results: IItemExcel[] = [];
    const testReq = [];

    const workbook = new ExcelJS.Workbook();
    const filePath = this.getFilePath(fileID);

    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet)
      throw new BadRequestException(
        'Sheet yang dipilih tidak tersedia di file Excel',
      );

    const rowCount = worksheet?.actualRowCount;
    if (rowCount > 30)
      throw new BadRequestException('Data worksheet terlalu besar');

    for (let i = 1; i <= rowCount; i++) {
      const row = worksheet.getRow(i);

      row.eachCell((cell, colNumber) => {
        const colLetter = cell.address.replace(/[0-9]/g, '');
        const address = cell.address;

        const value =
          typeof cell.value === 'object' &&
          cell.value !== null &&
          'text' in cell.value
            ? cell.value.text
            : (cell.value ?? '');

        let backgroundColor: string | null = null;
        const fill = cell.fill as ExcelJS.FillPattern | undefined;

        if (fill?.type === 'pattern' && fill.fgColor?.argb)
          backgroundColor = `#${fill.fgColor.argb}`;

        const fontColor: string | null = cell.font.color?.argb ?? null;
        const alignment: Partial<ExcelJS.Alignment> | null =
          cell.style?.alignment ?? null;

        results.push({
          colLetter,
          colNumber,
          address,
          backgroundColor,
          fontColor,
          value,
          alignment,
        });

        testReq.push({
          columnIndex: colNumber,
          rowIndex: row.number,
          label: value,
          isRequired: false,
          alignment,
          fontColor,
          backgroundColor,
        });
      });
    }

    // fs.unlink(filePath, () => {}); # hapus file

    return { results, testReq };
  }

  private getFilePath(fileId: string): string {
    const filePath = path.join(this.basePath, `${fileId}.xlsx`);

    if (!fs.existsSync(filePath))
      throw new NotFoundException('File not found or expired');

    return filePath;
  }
}

import * as ExcelJS from 'exceljs';

export interface IItemExcel {
  colLetter: string;
  colNumber: number;
  address: string;
  backgroundColor?: string;
  fontColor?: string;
  value: string | ExcelJS.CellHyperlinkValue | ExcelJS.CellValue;
  alignment?: Partial<ExcelJS.Alignment>;
}

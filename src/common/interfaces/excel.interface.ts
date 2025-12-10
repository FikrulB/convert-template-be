import * as ExcelJS from 'exceljs';

export interface IHeaderExcel {
  colLetter: string;
  colNumber: number;
  address: string;
  bgColor: string;
  value: string | ExcelJS.CellHyperlinkValue;
}

export interface IExcelJSON {
  headers: IHeaderExcel[];
  items: any[];
}

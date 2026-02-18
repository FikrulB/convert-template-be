import {
  EHorizontalAlignment,
  EVerticalAlignment,
} from '#/modules/template/template.dto';

export interface IAlignment {
  vertical?: EVerticalAlignment;
  horizontal?: EHorizontalAlignment;
}
export interface ITemplateDetail {
  id?: number;
  columnIndex: number;
  rowIndex: number;
  label: string;
  isRequired: boolean;
  alignment?: IAlignment;
  fontColor?: string;
  backgroundColor?: string;
}

export interface IHeaders {
  isMultiple: boolean;
}

export interface IHeaderSetting {
  groupingColumnLabel: string;
  headers: Record<string, IHeaders>;
}

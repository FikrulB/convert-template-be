import {
  EHorizontalAlignment,
  EVerticalAlignment,
} from '#/modules/template/template.dto';

export interface IAlignment {
  vertical?: EVerticalAlignment;
  horizontal?: EHorizontalAlignment;
}
export interface ITemplateDetail {
  columnIndex: number;
  rowIndex: number;
  label: string;
  isRequired: boolean;
  alignment?: IAlignment;
  fontColor?: string;
  backgroundColor?: string;
}

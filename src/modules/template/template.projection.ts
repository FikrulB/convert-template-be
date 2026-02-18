import { Prisma } from 'generated/prisma/client';

export const TemplateSelectBase = {
  code: true,
  name: true,
  description: true,
  data_orientation: true,
  is_multiple_header: true,
} satisfies Prisma.excel_templatesSelect;

export const TemplateSelectDetails = {
  excel_template_detail: {
    select: {
      id: true,
      column_index: true,
      row_index: true,
      label: true,
      is_required: true,
      alignment: true,
      font_color: true,
      background_color: true,
    },
  },
} satisfies Prisma.excel_templatesSelect;

export const TemplateSelectOwner = {
  users: {
    select: {
      unique_code: true,
      user_detail: {
        select: {
          fullname: true,
        },
      },
    },
  },
} satisfies Prisma.excel_templatesSelect;

export type TTemplateSelectBase = Prisma.excel_templatesGetPayload<{
  select: typeof TemplateProjection.base;
}>;

export type TTemplateWithDetailOwner = Prisma.excel_templatesGetPayload<{
  select: typeof TemplateProjection.baseDetailOwner;
}>;

export type TTemplateSelectOwner = Prisma.excel_templatesGetPayload<{
  select: typeof TemplateProjection.owner;
}>;

export type TTemplateWithDetails = Prisma.excel_templatesGetPayload<{
  select: typeof TemplateSelectDetails;
}>;

export type TTemplateDetail =
  TTemplateWithDetails['excel_template_detail'][number];

export const TemplateProjection = {
  base: {
    ...TemplateSelectBase,
  } satisfies Prisma.excel_templatesSelect,
  details: {
    ...TemplateSelectDetails,
  } satisfies Prisma.excel_templatesSelect,
  owner: {
    ...TemplateSelectOwner,
  } satisfies Prisma.excel_templatesSelect,
  baseDetailOwner: {
    ...TemplateSelectBase,
    ...TemplateSelectDetails,
    ...TemplateSelectOwner,
  } satisfies Prisma.excel_templatesSelect,
  full: {
    ...TemplateSelectBase,
    ...TemplateSelectDetails,
  } satisfies Prisma.excel_templatesSelect,
};

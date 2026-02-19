import { Prisma } from 'generated/prisma/client';

/* =========================
   SELECT FRAGMENTS
========================= */

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

export const TemplateSelectHeaderSettings = {
  excel_template_header_settings: {
    select: {
      id: true,
      grouping_column_label: true,
      excel_template_header: {
        select: {
          header_index: true,
          is_multiple: true,
        },
      },
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

/* =========================
   PROJECTION COMBINATIONS
========================= */

export const TemplateProjection = {
  base: {
    ...TemplateSelectBase,
  },

  details: {
    ...TemplateSelectDetails,
  },

  headers: {
    ...TemplateSelectHeaderSettings,
  },

  owner: {
    ...TemplateSelectOwner,
  },

  baseDetailOwner: {
    ...TemplateSelectBase,
    ...TemplateSelectDetails,
    ...TemplateSelectOwner,
  },

  full: {
    ...TemplateSelectBase,
    ...TemplateSelectDetails,
    ...TemplateSelectHeaderSettings,
    ...TemplateSelectOwner,
  },
} as const;

/* =========================
   PAYLOAD TYPES
========================= */

export type TTemplateSelectBase = Prisma.excel_templatesGetPayload<{
  select: typeof TemplateProjection.base;
}>;

export type TTemplateWithDetailOwner = Prisma.excel_templatesGetPayload<{
  select: typeof TemplateProjection.baseDetailOwner;
}>;

export type TTemplateSelectOwner = Prisma.excel_templatesGetPayload<{
  select: typeof TemplateProjection.owner;
}>;

export type TTemplateSelectFullInfo = Prisma.excel_templatesGetPayload<{
  select: typeof TemplateProjection.full;
}>;

export type TTemplateWithDetails = Prisma.excel_templatesGetPayload<{
  select: typeof TemplateProjection.details;
}>;

export type TTemplateHeaders = Prisma.excel_templatesGetPayload<{
  select: typeof TemplateProjection.headers;
}>;

export type TTemplateDetail =
  TTemplateWithDetails['excel_template_detail'][number];

export type TTemplateHeaderSetting =
  TTemplateHeaders['excel_template_header_settings'];

export type TTemplateHeader =
  NonNullable<TTemplateHeaderSetting>['excel_template_header'][number];

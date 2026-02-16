import { Prisma } from 'generated/prisma/client';

export const TemplateSelectBase = {
  code: true,
  name: true,
  description: true,
} satisfies Prisma.excel_templatesSelect;

export const TemplateSelectDetails = {
  data_orientation: true,
  is_multiple_header: true,
  excel_template_detail: {
    select: {
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
  detailsWithOwner: {
    ...TemplateSelectDetails,
    ...TemplateSelectOwner,
  } satisfies Prisma.excel_templatesSelect,
  full: {
    ...TemplateSelectBase,
    ...TemplateSelectDetails,
  } satisfies Prisma.excel_templatesSelect,
};

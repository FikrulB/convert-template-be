import { Prisma } from 'generated/prisma/client';

export const UserSelectBase = {
  id: true,
  unique_code: true,
  email: true,
  start_at: true,
  end_at: true,
  is_active: true,
  created_at: true,
} satisfies Prisma.usersSelect;

export const UserSelectPassword = {
  user_password: {
    where: { deleted_at: null },
    orderBy: { created_at: 'desc' },
    take: 1,
    select: {
      password: true,
    },
  },
} satisfies Prisma.usersSelect;

export const UserSelectRole = {
  user_role: {
    select: {
      role: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
    },
  },
} satisfies Prisma.usersSelect;

export const UserSelectDetail = {
  user_detail: {
    select: {
      avatar: true,
      fullname: true,
      address: true,
      phone_number: true,
    },
  },
} satisfies Prisma.usersSelect;

export const UserSelectAuthentication = {
  user_authentication: {
    select: {
      access_token: true,
      refresh_token: true,
    },
  },
} satisfies Prisma.usersSelect;

export const UserProjection = {
  base: {
    ...UserSelectBase,
  } satisfies Prisma.usersSelect,

  auth: {
    ...UserSelectBase,
    ...UserSelectAuthentication,
  } satisfies Prisma.usersSelect,

  profile: {
    ...UserSelectBase,
    ...UserSelectRole,
    ...UserSelectDetail,
  } satisfies Prisma.usersSelect,

  withPassword: {
    ...UserSelectBase,
    ...UserSelectPassword,
  } satisfies Prisma.usersSelect,

  profileWithPassword: {
    ...UserSelectBase,
    ...UserSelectRole,
    ...UserSelectDetail,
    ...UserSelectPassword,
  } satisfies Prisma.usersSelect,

  full: {
    ...UserSelectBase,
    ...UserSelectRole,
    ...UserSelectDetail,
    ...UserSelectPassword,
    ...UserSelectAuthentication,
  } satisfies Prisma.usersSelect,
};

export function buildUserSelect(options: {
  includePassword?: boolean;
  includeRole?: boolean;
  includeDetail?: boolean;
  includeAuthentication?: boolean;
}): Prisma.usersSelect {
  return {
    ...UserSelectBase,
    ...(options.includePassword && UserSelectPassword),
    ...(options.includeRole && UserSelectRole),
    ...(options.includeDetail && UserSelectDetail),
    ...(options.includeAuthentication && UserSelectAuthentication),
  };
}

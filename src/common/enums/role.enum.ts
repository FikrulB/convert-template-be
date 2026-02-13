import { createEnumMapper } from '#/common/utils/common.util';

export enum ERole {
  ADM = 'ADM', // Administrator
  USR = 'USR', // User
}

export const EnumMapper = createEnumMapper({
  [ERole.ADM]: 'ADM',
  [ERole.USR]: 'USR',
});

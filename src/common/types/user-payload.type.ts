import { ERole } from '#/common/enums/role.enum';

export interface TUserPayload {
  sub: string;
  email?: string;
  role: ERole;
}

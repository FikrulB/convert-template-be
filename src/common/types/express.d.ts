import { TUserPayload } from '#/common/types/user-payload.type';

declare global {
  namespace Express {
    interface Request {
      auth?: TUserPayload;
    }
  }
}

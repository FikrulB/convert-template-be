import { TUserPayload } from '#/common/types/user-payload.type';
import { firstValueFrom, Observable } from 'rxjs';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const result = super.canActivate(context);
    if (result instanceof Observable) return firstValueFrom(result);
    return result;
  }

  handleRequest<TUser = TUserPayload>(
    err: unknown,
    user: TUser | false | null,
  ): TUser {
    if (err || !user) {
      if (err instanceof Error) throw err;
      throw new UnauthorizedException();
    }
    return user;
  }
}

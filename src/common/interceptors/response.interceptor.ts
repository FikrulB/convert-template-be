import dayJs from '#/common/utils/dayjs.util';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'express';
import { IResponse } from '#/common/interfaces/response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  IResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<IResponse<T>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<Response>();

    return next.handle().pipe(
      map((data: T) => ({
        code: response.statusCode,
        message: 'Sukses',
        timestamp: dayJs().utc().toISOString(),
        data,
      })),
    );
  }
}

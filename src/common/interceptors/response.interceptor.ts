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
import { SerializeBigInt } from '#/common/types/interceptor.type';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  IResponse<SerializeBigInt<T>>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<IResponse<SerializeBigInt<T>>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data: T) => ({
        code: response.statusCode,
        message: 'Sukses',
        timestamp: dayJs().utc().toISOString(),
        data: serializeBigInt(data),
      })),
    );
  }
}

function _serializeBigInt(data: unknown): unknown {
  if (typeof data === 'bigint') {
    return Number(data);
  }

  if (Array.isArray(data)) {
    return data.map(_serializeBigInt);
  }

  if (data !== null && typeof data === 'object') {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(
      data as Record<string, unknown>,
    )) {
      result[key] = _serializeBigInt(value);
    }

    return result;
  }

  return data;
}

function serializeBigInt<T>(data: T): SerializeBigInt<T> {
  return _serializeBigInt(data) as SerializeBigInt<T>;
}

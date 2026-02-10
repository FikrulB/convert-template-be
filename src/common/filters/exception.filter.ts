import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ValidationErrorItem {
  property: string;
  constraints: Record<string, string>;
}

interface BadRequestExceptionResponse {
  statusCode: number;
  message: ValidationErrorItem[] | string;
  error: string;
}

interface GenericHttpExceptionResponse {
  statusCode?: number;
  message?: string;
  error?: string;
}

function isValidationErrorResponse(
  response: unknown,
): response is BadRequestExceptionResponse & {
  message: ValidationErrorItem[];
} {
  return (
    typeof response === 'object' &&
    response !== null &&
    'message' in response &&
    Array.isArray((response as { message: unknown }).message)
  );
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { code, message, data, error } = this.extractErrorDetails(exception);

    this.logError(exception, request.url);

    response.status(code).json({
      code,
      message,
      data,
      error,
    });
  }

  private stringifyException(exception: unknown): string {
    if (exception instanceof Error) return exception.message;

    if (typeof exception === 'string') return exception;

    if (
      typeof exception === 'number' ||
      typeof exception === 'boolean' ||
      exception === null ||
      exception === undefined
    )
      return exception as string;

    if (typeof exception === 'object' && exception !== null) {
      try {
        return JSON.stringify(exception);
      } catch {
        return '[Unserializable object]';
      }
    }

    return '[Unknown exception type]';
  }

  private extractErrorDetails(exception: unknown): {
    code: number;
    message: string;
    data: null;
    error: unknown;
  } {
    if (exception instanceof HttpException) {
      const code = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        code === Number(HttpStatus.BAD_REQUEST) &&
        isValidationErrorResponse(exceptionResponse)
      ) {
        return {
          code,
          message: 'Permintaan tidak valid. Silakan periksa dan coba lagi.',
          data: null,
          error: exceptionResponse.message.map((err) => ({
            field: err.property,
            message: Object.values(err.constraints),
          })),
        };
      }

      if (typeof exceptionResponse === 'string') {
        return {
          code,
          message: exceptionResponse,
          data: null,
          error: null,
        };
      }

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const res = exceptionResponse as GenericHttpExceptionResponse;
        return {
          code,
          message:
            code === Number(HttpStatus.INTERNAL_SERVER_ERROR)
              ? 'Mohon maaf, terjadi kesalahan tidak terduga.'
              : (res.message ?? 'Terjadi kesalahan'),
          data: null,
          error:
            code === Number(HttpStatus.INTERNAL_SERVER_ERROR)
              ? null
              : (res.error ?? null),
        };
      }
    }

    return {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Mohon maaf, terjadi kesalahan tidak terduga.',
      data: null,
      error: this.stringifyException(exception),
    };
  }

  private logError(exception: unknown, url: string): void {
    const errorDetails =
      exception instanceof Error
        ? exception.stack
        : this.stringifyException(exception);
    console.error(`Error occurred at ${url}: ${errorDetails}`);
  }
}

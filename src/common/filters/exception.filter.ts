import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    const { code, message, data, error } = this.extractErrorDetails(exception);

    // Log error details
    this.logError(exception, request.url);

    // Send error response
    response.status(code).json({
      code,
      message,
      data,
      error,
    });
  }

  /**
   * Extracts error details based on the type of exception.
   * @param exception The exception to process.
   */
  private extractErrorDetails(exception: unknown): {
    code: number;
    message: string;
    data: any;
    error: string | null;
  } {
    if (exception instanceof HttpException) {
      const code = exception.getStatus();
      const response = exception.getResponse();

      const errorWhitelistStatus = [
        Number(HttpStatus.INTERNAL_SERVER_ERROR),
        Number(HttpStatus.BAD_REQUEST),
      ];

      const isError = errorWhitelistStatus.includes(code);

      return {
        code,
        message: this.getMessageFromResponse(response, isError, code),
        data: null,
        error: isError ? this.getErrorFromResponse(response, code) : null,
      };
    }

    return {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Mohon maaf, terjadi kesalahan tidak terduga.',
      data: null,
      error:
        (exception as any)?.message ||
        (typeof exception === 'object'
          ? JSON.stringify(exception)
          : (exception as any).toString()),
    };
  }

  /**
   * Extracts the error message from an HttpException response.
   * @param response The exception response.
   * @param isInternalError Flag to determine if it is an internal server error.
   */
  private getMessageFromResponse(
    response: any,
    isInternalError: boolean,
    code: number,
  ): string {
    if (isInternalError && code === Number(HttpStatus.INTERNAL_SERVER_ERROR))
      return 'Mohon maaf, terjadi kesalahan tidak terduga.';
    return response?.message || 'Mohon maaf, terjadi kesalahan tidak terduga.';
  }

  /**
   * Extracts the error details from an HttpException response.
   * @param response The exception response.
   */
  private getErrorFromResponse(response: any, code: number): string | null {
    return (
      (code === Number(HttpStatus.INTERNAL_SERVER_ERROR)
        ? response?.message
        : response?.error) ?? null
    );
  }

  /**
   * Logs the error details for debugging purposes.
   * @param exception The exception to log.
   * @param url The URL where the error occurred.
   */
  private logError(exception: unknown, url: string): void {
    const errorDetails =
      exception instanceof Error
        ? exception.stack
        : (exception as any)?.toString();
    console.error(`Error occurred at ${url}: ${errorDetails}`);
  }
}

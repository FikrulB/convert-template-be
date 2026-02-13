import { AppModule } from '#/app.module';
import { GlobalExceptionFilter } from '#/common/filters/exception.filter';
import { ResponseInterceptor } from '#/common/interceptors/response.interceptor';
import { IFormattedError } from '#/common/interfaces/format-error.interface';
import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // Interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const formattedErrors = (error: ValidationError[]) => {
          const errMsg: IFormattedError[] = [];
          error.forEach((err) => {
            if (err.constraints)
              errMsg.push(
                ...Object.values(err.constraints).map((message) => ({
                  field: err.property,
                  message,
                })),
              );

            if (err.children) errMsg.push(...formattedErrors(err.children));
          });

          return errMsg;
        };

        const errorMessages = formattedErrors(errors);

        return new BadRequestException({
          code: HttpStatus.BAD_REQUEST,
          message: 'Permintaan tidak valid. Silakan periksa dan coba lagi.',
          data: null,
          error: errorMessages,
        });
      },
    }),
  );

  // Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3004);
  console.log(`✅ Application running on port ${process.env.PORT ?? 3004}`);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to bootstrap application', err);
  process.exit(1);
});

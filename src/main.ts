import { AppModule } from '#/app.module';
import { GlobalExceptionFilter } from '#/common/filters/exception.filter';
import { ResponseInterceptor } from '#/common/interceptors/response.interceptor';
import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.flatMap((error) => {
          return Object.values(error.constraints).map((message) => ({
            field: error.property,
            message,
          }));
        });

        return new BadRequestException({
          code: HttpStatus.BAD_REQUEST,
          message: 'Permintaan tidak valid. Silakan periksa dan coba lagi.',
          data: null,
          error: formattedErrors,
        });
      },
    }),
  );

  // Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3004);
  console.log(`✅ Application running on port ${process.env.PORT ?? 3004}`);
}
bootstrap();

import { AppModule } from '#/app.module';
import { GlobalExceptionFilter } from '#/common/filters/exception.filter';
import { ResponseInterceptor } from '#/common/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
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

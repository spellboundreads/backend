import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JSendExceptionFilter } from './common/filters/jsend-exception.filter';
import { JSendInterceptor } from './common/interceptors/jsend.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalInterceptors(new JsonApiInterceptor());
  app.useGlobalInterceptors(new JSendInterceptor());
  app.useGlobalFilters(new JSendExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: `http://localhost:4000`,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    // credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

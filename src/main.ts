/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { dbConfig } from './config/db';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger: ['error'],
  });

  app.enableCors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  try {
    await dbConfig.initialize();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:',error);
    process.exit(1);
  }
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Application is running on: http://localhost:${process.env.PORT}`);
  });
}
bootstrap();

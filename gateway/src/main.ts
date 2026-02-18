import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { setupSwagger } from './core/config/swagger.config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('GatewayBootstrap');
  
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);

  app.use(helmet());

  app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
});

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  setupSwagger(app);

  const port = configService.get<number>('PORT') || 3000;
  
  await app.listen(port);
  
  logger.log(`Gateway is running on: http://localhost:${port}/api/v1`);
  logger.log(`Swagger is running on: http://localhost:${port}/api/docs`);
}
bootstrap();
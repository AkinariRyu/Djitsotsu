import { NestFactory } from '@nestjs/core';
import { AuthModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  app.enableCors();

  const port = process.env.PORT || 3001;
  await app.listen(port);

  Logger.log(`Server is running on: http://localhost:${port}`);
  Logger.log(`Auth routes are at: http://localhost:${port}/auth/send-otp`);
}
bootstrap();
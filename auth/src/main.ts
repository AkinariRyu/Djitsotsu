import { NestFactory } from '@nestjs/core';
import { AuthModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from '@contracts/auth/auth.generated';
import { join } from 'path';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('AuthBootstrap');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50051',
      package: AUTH_PACKAGE_NAME,
      protoPath: join(process.cwd(), '../contracts/proto/auth/auth.proto'),
    },
  });

  await app.listen();
  logger.log('Microservice is listening on grpc://0.0.0.0:50051');
}
bootstrap();
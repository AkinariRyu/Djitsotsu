import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:4300'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Djitsotsu API')
    .setDescription('API for the Djitsotsu')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = Number(process.env.PORT) || 5400;
  await app.listen(port);
  console.log(`Gateway listening on ${port}`);
  console.log(`Swagger: http://localhost:${port}/docs`);
}
bootstrap();

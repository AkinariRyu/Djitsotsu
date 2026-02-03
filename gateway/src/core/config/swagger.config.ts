import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

export function setupSwagger(app: INestApplication): void {
  const configService = app.get(ConfigService);
  const environment = configService.get('NODE_ENV');

  if (environment === 'production') {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle('Djitsostu Gateway')
    .setDescription('Entry point for Djitsostu API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Endpoints for authentication')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
    },
  });
}
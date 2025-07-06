import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const configSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Restaurant API')
    .setDescription('Restaurant API description')
    .setVersion('1.0')
    .addTag('restaurant');

  config.addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'JWT access token을 입력하세요.',
      in: 'header',
    },
    'access-token',
  );

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup('api', app, documentFactory);
};

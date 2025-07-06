import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const configSwagger = (app: INestApplication) => {
  const cb = new DocumentBuilder()
    .setTitle('Restaurant API')
    .setDescription('Restaurant API description')
    .setVersion('1.0')
    .addTag('restaurant');

  cb.addBearerAuth(
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

  const config = cb.build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};

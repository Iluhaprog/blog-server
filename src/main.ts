import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.ORIGIN || true,
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: 'Authorization, Content-Type, Accept',
  });
  const config = new DocumentBuilder()
    .setTitle('Blog server')
    .setDescription('API for managing blog data')
    .setVersion('0.0.1')
    .addBearerAuth()
    .addBasicAuth()
    .addTag('user')
    .addTag('social')
    .addTag('post')
    .addTag('tag')
    .addTag('home')
    .addTag('project')
    .addTag('file')
    .addTag('directory')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(+process.env.PORT);
}
bootstrap();

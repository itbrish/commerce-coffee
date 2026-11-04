import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  // Enable CORS for localhost and any local network IP (Android / iPhone / LAN devices)
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Brewparts E-Commerce & Precision Machinery API')
    .setDescription('Production-ready REST API for espresso machines, precision parts, inventory, transactional checkout, WhatsApp integration, and editorial CMS by PT Satu Saudara Sedarah.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  // Listen on 0.0.0.0 to allow access from Android, iPhone, and LAN devices
  await app.listen(port, '0.0.0.0');
  console.log('Brewparts API is running on: http://0.0.0.0:' + port + '/api/v1');
  console.log('Swagger documentation at: http://localhost:' + port + '/api/docs');
}
bootstrap();

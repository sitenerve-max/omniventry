import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AppConfig } from './config/configuration';
import { AllExceptionsFilter } from './common/http-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService).getOrThrow<AppConfig>('app');

  // Default (false): req.ip is the socket address and X-Forwarded-For is ignored, so clients cannot
  // spoof their IP to dodge rate limits. Behind a reverse proxy set TRUST_PROXY (hop count or trusted
  // proxy addresses) so the real client IP is used; see server/README.md.
  app.getHttpAdapter().getInstance().set('trust proxy', config.trustProxy);
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({ origin: config.frontendOrigin, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('OEMInventory API')
    .setDescription('MVP backend: auth, product search, RFQ -> vendor RFQ -> supplier quote -> customer quotation')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(config.port);
  // eslint-disable-next-line no-console
  console.log(`OEMInventory API listening on http://localhost:${config.port} (docs at /api/docs)`);
}

bootstrap();

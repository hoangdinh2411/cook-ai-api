import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { CorsConfigService } from 'config/cors.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerApiDocService } from 'config/apiDocs.config';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from 'common/exceptions/httpException.filter';
import { ResponseFormatInterceptor } from 'common/interceptors/responseFormat.interceptor';
import { AppModule } from 'app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  const logger = new Logger('EnvLogger');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
      forbidNonWhitelisted: true,
    }),
  );
  const configServer = new ConfigService();
  const corsConfigService = app.get(CorsConfigService);
  app.use(
    json({
      limit: '50mb',
    }),
  );
  app.use(
    urlencoded({
      extended: true,
      limit: '50mb',
    }),
  );
  const isProd = configServer.get<string>('NODE_ENV') === 'production';
  if (!isProd) {
    const swaggerApiDoc = app.get(SwaggerApiDocService);
    swaggerApiDoc.setUp(app);
  }
  logger.log(configServer.get(<string>'NODE_ENV'));
  app.enableCors(corsConfigService.getOptions(configServer));
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  await app.listen(configServer.get<string>('API_PORT'));
}
bootstrap();

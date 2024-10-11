require("dotenv").config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';
import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import helmet from "helmet";
import logger from './logger'
import { DEFAULT_PORT } from './constants';
import { HttpExceptionFilter } from './utils/error-handler/http-exception.filter';
import { requestLogger } from './middlewares/request.logger';
import { setupSwagger } from './utils/swagger';

function normalizePort() {
  return process.env.PORT ? process.env.PORT : DEFAULT_PORT;
}

function onAppListen() {
  Logger.log(`API running on port ${normalizePort()}`, "API");
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));
  app.use(requestLogger({ log: logger.log }));
  app.use(helmet());
  setupSwagger(app);

  await app.listen(normalizePort(), onAppListen);
}

bootstrap();

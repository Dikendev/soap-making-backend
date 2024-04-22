import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
const PORT = process.env.PORT;

(async () => {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
  const logger = new Logger('NestApplication');
  logger.log(`Application is running on: ${PORT}`);
})();

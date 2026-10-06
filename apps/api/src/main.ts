import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PinoLoggerAdapter } from './common/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new PinoLoggerAdapter(),
  });
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();

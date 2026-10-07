import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PinoLoggerAdapter } from './common/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new PinoLoggerAdapter(),
  });
  // Izinkan web/mobile (origin berbeda) memanggil API — tanpa ini browser
  // memblokir fetch lintas port (CORS).
  app.enableCors();
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();

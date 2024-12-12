import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); 
  const port = configService.get('PORT', 3000); 

  try {
    await app.listen(port);
    Logger.log(`🚀 Server started on http://localhost:${port}`); 
  } catch (error) {
    Logger.error('❌ Server failed to start:', error);
  }
}
bootstrap();

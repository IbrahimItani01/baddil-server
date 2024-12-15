import { NestFactory } from '@nestjs/core';
import { SeederService } from './seeders.service';
import { SeederModule } from './seeders.module';


async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);
  const seederService = app.get(SeederService);

  await seederService.seedBarterers(10); // Seed 10 barterers
  await seederService.seedBrokers(5);    // Seed 5 brokers

  await app.close();
}

bootstrap();

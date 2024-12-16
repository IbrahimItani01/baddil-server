
import { NestFactory } from '@nestjs/core';
import { CompanySeeder } from './company/company.seeder';
import { UsersSeeder } from './users/users.seeder';
import { BarterersSeeder } from './barterers/barterers.seeder';
import { BrokersSeeder } from './brokers/brokers.seeder';
import { BartersSeeder } from './barters/barters.seeder';
import { ChatsSeeder } from './chats/chats.seeder';
import { DisputesSeeder } from './disputes/disputes.seeder';
import { FlagsSeeder } from './flags/flags.seeder';
import { NotificationsSeeder } from './notifications/notifications.seeder';
import { SeedersModule } from './seeders.module';

async function seedDatabase() {
  const app = await NestFactory.createApplicationContext(SeedersModule);

  try {
    console.log('🛠️ Starting database seeding...');

    

import { NestFactory } from '@nestjs/core';
import { SeedersModule } from './seeders.module';
import { CompanySeeder } from './company/company.seeder';
import { UsersSeeder } from './users/users.seeder';
import { BarterersSeeder } from './barterers/barterers.seeder';
import { BrokersSeeder } from './brokers/brokers.seeder';
import { BartersSeeder } from './barters/barters.seeder';
import { ChatsSeeder } from './chats/chats.seeder';
import { DisputesSeeder } from './disputes/disputes.seeder';
import { FlagsSeeder } from './flags/flags.seeder';
import { NotificationsSeeder } from './notifications/notifications.seeder';

async function seedDatabase() {
  const app = await NestFactory.create(SeedersModule);
  await app.listen(4000);

  try {
    console.log('🛠️ Starting database seeding on port 4000...');

    const companySeeder = app.get(CompanySeeder);
    const usersSeeder = app.get(UsersSeeder);
    const barterersSeeder = app.get(BarterersSeeder);
    const brokersSeeder = app.get(BrokersSeeder);
    const bartersSeeder = app.get(BartersSeeder);
    const chatsSeeder = app.get(ChatsSeeder);
    const disputesSeeder = app.get(DisputesSeeder);
    const flagsSeeder = app.get(FlagsSeeder);
    const notificationsSeeder = app.get(NotificationsSeeder);
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
  } finally {
    await app.close();
  }
}

seedDatabase();

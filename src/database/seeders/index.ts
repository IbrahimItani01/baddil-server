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
    console.log('🛠️ Starting database seeding...');

    // Get models and seeders
    const models = getModels(app);
    const seeders = SEEDERS.map((Seeder) => app.get(Seeder));

    // Clear the database
    await clearDatabase(models);

    // Seed the database
    await seedData(seeders);

    console.log('🚀 Seeding process finished!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
  } finally {
    await app.close();
  }
}

seedDatabase();

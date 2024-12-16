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

    const companySeeder = app.get(CompanySeeder);
    const usersSeeder = app.get(UsersSeeder);
    const barterersSeeder = app.get(BarterersSeeder);
    const brokersSeeder = app.get(BrokersSeeder);
    const bartersSeeder = app.get(BartersSeeder);
    const chatsSeeder = app.get(ChatsSeeder);
    const disputesSeeder = app.get(DisputesSeeder);
    const flagsSeeder = app.get(FlagsSeeder);
    const notificationsSeeder = app.get(NotificationsSeeder);

    console.log('🧹 Clearing existing data...');

    const companyModel = companySeeder.getModel();
    const userModel = usersSeeder.getModel();
    const bartererModel = barterersSeeder.getModel();
    const brokerModel = brokersSeeder.getModel();
    const barterModel = bartersSeeder.getModel();
    const chatModel = chatsSeeder.getModel();
    const disputeModel = disputesSeeder.getModel();
    const flagModel = flagsSeeder.getModel();
    const notificationModel = notificationsSeeder.getModel();

    await Promise.all([
      companyModel.deleteMany({}),
      userModel.deleteMany({}),
      bartererModel.deleteMany({}),
      brokerModel.deleteMany({}),
      barterModel.deleteMany({}),
      chatModel.deleteMany({}),
      disputeModel.deleteMany({}),
      flagModel.deleteMany({}),
      notificationModel.deleteMany({}),
    ]);

    console.log('✅ Database cleared. Starting to seed data...');

    await companySeeder.seed();
    await usersSeeder.seed(100);
    await barterersSeeder.seed();
    await brokersSeeder.seed();
    await bartersSeeder.seed(15);
    await chatsSeeder.seed();
    await disputesSeeder.seed();
    await flagsSeeder.seed();
    await notificationsSeeder.seed();

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
  } finally {
    await app.close();
  }
}

seedDatabase();

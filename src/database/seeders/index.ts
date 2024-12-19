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

    await usersSeeder.seed(10);
    console.log('✅ Users seeding completed.');

    await disputesSeeder.seed();
    console.log('✅ Disputes seeding completed.');

    await notificationsSeeder.seed();
    console.log('✅ Notifications seeding completed.');

    await chatsSeeder.seed();
    console.log('✅ Chats seeding completed.');

    await barterersSeeder.seed(true);
    console.log('✅ Barterers (first call) seeding completed.');

    await brokersSeeder.seed(true);
    console.log('✅ Brokers (first call) seeding completed.');

    await bartersSeeder.seed(15);
    console.log('✅ Barters seeding completed.');

    await barterersSeeder.seed(false);
    console.log('✅ Barterers (second call) seeding completed.');

    await brokersSeeder.seed(false);
    console.log('✅ Brokers (second call) seeding completed.');

    await flagsSeeder.seed();
    console.log('✅ Flags seeding completed.');

    await companySeeder.seed();
    console.log('✅ Company seeding completed.');

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
  } finally {
    await app.close();
  }
}

seedDatabase();

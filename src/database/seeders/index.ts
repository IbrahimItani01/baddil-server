import { PrismaClient } from '@prisma/client';
import { clearDatabase } from './resetter';
import { seedBarters } from './seeds/barters.seed';
import { seedCategories } from './seeds/categories.seed';
import { seedChats } from './seeds/chats.seed';
import { seedDisputes } from './seeds/disputes.seed';
import { seedExpenses } from './seeds/expenses.seed';
import { seedFeatures } from './seeds/features.seed';
import { seedHires } from './seeds/hires.seed';
import { seedItems } from './seeds/items.seed';
import { seedLocations } from './seeds/locations.seed';
import { seedMeetups } from './seeds/meetups.seed';
import { seedMessages } from './seeds/messages.seed';
import { seedProfits } from './seeds/profits.seed';
import { seedRatings } from './seeds/ratings.seed';
import { seedSettings } from './seeds/settings.seed';
import { seedSubcategories } from './seeds/subCategories.seed';
import { seedSubscriptionPlans } from './seeds/subscriptionPlans.seed';
import { seedTiers } from './seeds/tiers.seed';
import { seedUsers } from './seeds/users.seed';
import { seedUserStatuses } from './seeds/userStatuses.seed';
import { seedUserTypes } from './seeds/userTypes.seed';
import { seedWallets } from './seeds/wallets.seed';

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log('🚀 Starting seeding process...');

    await clearDatabase(prisma);

    console.log('🌱 Seeding independent tables...');
    await seedUserTypes(prisma);
    console.log('✅ Seeded: User Types');

    await seedUserStatuses(prisma);
    console.log('✅ Seeded: User Statuses');

    await seedSettings(prisma);
    console.log('✅ Seeded: Settings');

    await seedTiers(prisma);
    console.log('✅ Seeded: Tiers');

    await seedSubscriptionPlans(prisma);
    console.log('✅ Seeded: Subscription Plans');

    await seedCategories(prisma);
    console.log('✅ Seeded: Categories');
    
    await seedLocations(prisma);
    console.log('✅ Seeded: Locations');

    console.log('🌱 Seeding dependent tables...');
    await seedUsers(prisma);
    console.log('✅ Seeded: Users');

    await seedSubcategories(prisma);
    console.log('✅ Seeded: Subcategories');

    await seedWallets(prisma);
    console.log('✅ Seeded: Wallets');

    await seedFeatures(prisma);
    console.log('✅ Seeded: Features');

    console.log('🌱 Seeding financial data...');
    await seedExpenses(prisma);
    console.log('✅ Seeded: Expenses');

    await seedProfits(prisma);
    console.log('✅ Seeded: Profits');

    console.log('🌱 Seeding items and related data...');
    await seedItems(prisma);
    console.log('✅ Seeded: Items');

    console.log('🌱 Seeding meetups...');
    await seedMeetups(prisma);
    console.log('✅ Seeded: Meetups');

    console.log('🌱 Seeding barters and hires...');
    await seedHires(prisma);
    console.log('✅ Seeded: Hires');

    await seedBarters(prisma);
    console.log('✅ Seeded: Barters');

    console.log('🌱 Seeding chats and messages...');
    await seedChats(prisma);
    console.log('✅ Seeded: Chats');

    await seedMessages(prisma);
    console.log('✅ Seeded: Messages');

    console.log('🌱 Seeding ratings and disputes...');
    await seedRatings(prisma);
    console.log('✅ Seeded: Ratings');

    await seedDisputes(prisma);
    console.log('✅ Seeded: Disputes');

    console.log('🎉 Seeding process completed successfully!');
  } catch (error) {
    console.error('❌ Error while seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

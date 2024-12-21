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
  try {
    console.log('🚀 Starting seeding process...');

    await clearDatabase();

    console.log('🌱 Seeding independent tables...');
    await seedUserTypes();
    console.log('✅ Seeded: User Types');

    await seedUserStatuses();
    console.log('✅ Seeded: User Statuses');

    await seedSettings();
    console.log('✅ Seeded: Settings');

    await seedTiers();
    console.log('✅ Seeded: Tiers');

    await seedSubscriptionPlans();
    console.log('✅ Seeded: Subscription Plans');

    await seedCategories();
    console.log('✅ Seeded: Categories');

    await seedLocations();
    console.log('✅ Seeded: Locations');

    console.log('🌱 Seeding dependent tables...');
    await seedUsers();
    console.log('✅ Seeded: Users');

    await seedSubcategories();
    console.log('✅ Seeded: Subcategories');

    await seedWallets();
    console.log('✅ Seeded: Wallets');

    await seedFeatures();
    console.log('✅ Seeded: Features');

    console.log('🌱 Seeding financial data...');
    await seedExpenses();
    console.log('✅ Seeded: Expenses');

    await seedProfits();
    console.log('✅ Seeded: Profits');

    console.log('🌱 Seeding items and related data...');
    await seedItems();
    console.log('✅ Seeded: Items');

    console.log('🌱 Seeding meetups...');
    await seedMeetups();
    console.log('✅ Seeded: Meetups');

    console.log('🌱 Seeding barters and hires...');
    await seedHires();
    console.log('✅ Seeded: Hires');

    await seedBarters();
    console.log('✅ Seeded: Barters');

    console.log('🌱 Seeding chats and messages...');
    await seedChats();
    console.log('✅ Seeded: Chats');

    await seedMessages();
    console.log('✅ Seeded: Messages');

    console.log('🌱 Seeding ratings and disputes...');
    await seedRatings();
    console.log('✅ Seeded: Ratings');

    await seedDisputes();
    console.log('✅ Seeded: Disputes');

    console.log('🎉 Seeding process completed successfully!');
  } catch (error) {
    console.error('❌ Error while seeding:', error);
  }
}

main();

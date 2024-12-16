import { NestFactory } from '@nestjs/core';
import { SeedersModule } from './seeders.module';
import { getModels, SEEDERS } from '../../utils/seeders/constants';
import { clearDatabase, seedData } from '../../utils/seeders/seeder.utils';

async function seedDatabase() {
  const app = await NestFactory.createApplicationContext(SeedersModule);

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

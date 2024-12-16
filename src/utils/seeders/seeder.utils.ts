import { Model } from 'mongoose';

export const clearDatabase = async (models: Model<any>[]): Promise<void> => {
  console.log('🧹 Clearing existing data...');
  const promises = models.map((model) => model.deleteMany({}));
  await Promise.all(promises);
  console.log('✅ Database cleared.');
};

export const seedData = async (seeders: { seed: () => Promise<void> }[]): Promise<void> => {
  console.log('🌱 Starting to seed data...');
  for (const seeder of seeders) {
    await seeder.seed();
  }
  console.log('🎉 Data seeding completed successfully!');
};

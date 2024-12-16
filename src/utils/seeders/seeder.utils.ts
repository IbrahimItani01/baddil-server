import { Model } from 'mongoose';

export const clearDatabase = async (models: Model<any>[]): Promise<void> => {
  console.log('🧹 Clearing existing data...');
  const promises = models.map((model) => model.deleteMany({}));
  await Promise.all(promises);
  console.log('✅ Database cleared.');
};


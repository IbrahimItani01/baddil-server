import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const seedLocations = async (prisma: PrismaClient) => {
  console.log('Seeding Locations...');

  // Generate random locations
  await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      await prisma.location.create({
        data: {
          name: faker.location.city(),
          longitude: faker.location.longitude(),
          latitude: faker.location.latitude(),
        },
      });
    }),
  );

  console.log('Locations seeded successfully.');
};

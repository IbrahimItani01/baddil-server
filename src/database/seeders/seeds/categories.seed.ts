import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export const seedCategories = async () => {
  console.log('Seeding Categories...');

  await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.category.create({
        data: {
          name: faker.commerce.department(),
          category_icon: faker.image.url(),  // Updated to use imageUrl()
        },
      }),
    ),
  );

  console.log('Categories seeded successfully.');
};

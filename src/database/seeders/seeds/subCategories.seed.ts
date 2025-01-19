import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const seedSubcategories = async (prisma: PrismaClient) => {
  console.log('Seeding Subcategories...');

  // Fetch existing categories to associate subcategories with them
  const categories = await prisma.category.findMany();

  if (categories.length === 0) {
    throw new Error('No categories found. Seed categories first.');
  }

  // Generate random subcategories
  await Promise.all(
    Array.from({ length: 10 }).map(() => {
      const randomCategory = faker.helpers.arrayElement(categories); // Pick a random category
      return prisma.subcategory.create({
        data: {
          name: faker.commerce.productName(), // Generate a random subcategory name
          main_category_id: randomCategory.id, // Assign a category to the subcategory
        },
      });
    }),
  );

  console.log('Subcategories seeded successfully.');
};

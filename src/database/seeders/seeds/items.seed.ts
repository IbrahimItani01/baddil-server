import { ItemCondition, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export const seedItems = async () => {
  console.log('Seeding Items...');

  // Fetch categories, subcategories, locations, and wallets to associate with the items
  const categories = await prisma.category.findMany();
  const subcategories = await prisma.subcategory.findMany();
  const locations = await prisma.location.findMany();
  const wallets = await prisma.wallet.findMany();

  if (
    categories.length < 1 ||
    subcategories.length < 1 ||
    locations.length < 1 ||
    wallets.length < 1
  ) {
    throw new Error(
      'Not enough categories, subcategories, locations, or wallets to create items.',
    );
  }


  // Generate random items
  await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      const category = faker.helpers.arrayElement(categories);
      const subcategory = faker.helpers.arrayElement(subcategories);
      const location = faker.helpers.arrayElement(locations);
      const wallet = faker.helpers.arrayElement(wallets);
      const condition: ItemCondition = faker.helpers.arrayElement([
        ItemCondition.used,
        ItemCondition.new,
        ItemCondition.refurbished,
      ]);
      const value = parseFloat(
        faker.finance.amount({ min: 10, max: 1000, dec: 2 }),
      ); // Random value
      const description = faker.lorem.sentence();

      // Create the item
      const item = await prisma.item.create({
        data: {
          name: faker.commerce.productName(),
          description,
          category_id: category.id.toString(), // Ensure the ID is treated as a string
          subcategory_id: subcategory.id.toString(), // Ensure the ID is treated as a string
          location_id: location.id.toString(), // Ensure the ID is treated as a string
          wallet_id: wallet.id.toString(), // Ensure the ID is treated as a string
          condition,
          value,
        },
      });

      // Create random item images for each item
      const imageCount = faker.number.int({ min: 1, max: 3 }); // Random number of images per item
      await Promise.all(
        Array.from({ length: imageCount }).map(async () => {
          await prisma.itemImage.create({
            data: {
              item_id: item.id.toString(), // Ensure the ID is treated as a string
              path: faker.image.url(),
            },
          });
        }),
      );
    }),
  );

  console.log('Items seeded successfully.');
};

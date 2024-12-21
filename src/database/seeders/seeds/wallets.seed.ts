import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export const seedWallets = async () => {
  console.log('Seeding Wallets...');

  // Fetch the user type ID for 'barterer'
  const bartererUserType = await prisma.userType.findFirst({
    where: { type: 'barterer' }, // Adjust to match the actual 'barterer' type in your UserType table
  });

  if (!bartererUserType) {
    throw new Error('User type "barterer" not found.');
  }

  // Fetch users of type 'barterer'
  const barterers = await prisma.user.findMany({
    where: { user_type_id: bartererUserType.id },
  });

  if (barterers.length < 1) {
    throw new Error('Not enough barterers to create wallets.');
  }

  // Generate random wallets
  await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      const owner = faker.helpers.arrayElement(barterers); // Random barterer user

      await prisma.wallet.create({
        data: {
          owner_id: owner.id,
        },
      });
    }),
  );

  console.log('Wallets seeded successfully.');
};

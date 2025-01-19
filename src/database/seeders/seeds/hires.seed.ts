import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const seedHires = async (prisma: PrismaClient) => {
  console.log('Seeding Hires...');

  // Fetch user types for broker and barterer
  const userTypes = await prisma.userType.findMany({
    where: {
      type: {
        in: ['broker', 'barterer'], // Ensure we only fetch broker and barterer types
      },
    },
  });

  const brokerType = userTypes.find((type) => type.type === 'broker');
  const bartererType = userTypes.find((type) => type.type === 'barterer');

  if (!brokerType || !bartererType) {
    throw new Error('Broker or Barterer user types not found.');
  }

  // Fetch users based on user type (broker or barterer)
  const brokers = await prisma.user.findMany({
    where: {
      user_type_id: brokerType.id.toString(), // Ensure `user_type_id` is treated as a string
    },
  });

  const barterers = await prisma.user.findMany({
    where: {
      user_type_id: bartererType.id.toString(), // Ensure `user_type_id` is treated as a string
    },
  });

  // Fetch all items to create valid hires
  const items = await prisma.item.findMany();

  if (brokers.length < 1 || barterers.length < 1 || items.length < 1) {
    throw new Error('Not enough brokers, barterers, or items to create hires.');
  }

  // Generate random hires
  await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      const broker = faker.helpers.arrayElement(brokers); // Random broker (broker type)
      const client = faker.helpers.arrayElement(barterers); // Random client (barterer type)
      const targetItem = faker.helpers.arrayElement(items); // Random item for hire
      const budget = parseFloat(
        faker.finance.amount({ min: 1000, max: 50000, dec: 2 }),
      ); // Random budget amount
      const hireStatus = faker.helpers.arrayElement([
        'pending',
        'ongoing',
        'cancelled',
        'completed',
      ]);
      const completedAt = hireStatus === 'completed' ? faker.date.past() : null;

      await prisma.hire.create({
        data: {
          target_item_id: targetItem.id.toString(), // Ensure `target_item_id` is treated as a string
          broker_id: broker.id.toString(), // Ensure `broker_id` is treated as a string
          client_id: client.id.toString(), // Ensure `client_id` is treated as a string
          budget,
          status: hireStatus,
          completed_at: completedAt,
          created_at: faker.date.past(), // Random creation date
        },
      });
    }),
  );

  console.log('Hires seeded successfully.');
};

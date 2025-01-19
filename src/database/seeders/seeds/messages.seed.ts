import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const seedMessages = async (prisma: PrismaClient) => {
  console.log('Seeding Messages...');

  // Fetch all chats to associate messages with
  const chats = await prisma.chat.findMany({
    include: {
      barter: true, // Include Barter relation
      hire: true, // Include Hire relation
    },
  });

  if (chats.length < 1) {
    throw new Error('Not enough chats to create messages.');
  }

  // Generate random messages
  await Promise.all(
    Array.from({ length: 50 }).map(async () => {
      // Select a random chat
      const chat = faker.helpers.arrayElement(chats);

      let possibleOwners: string[] = []; // Changed to string[]

      // Determine possible owners based on chat's related hire or barter
      if (chat.hire_id) {
        const hire = chat.hire; // Hire relation is already included
        possibleOwners = [hire.client_id, hire.broker_id];
      } else if (chat.barter_id) {
        const barter = chat.barter; // Barter relation is already included
        possibleOwners = [barter.user1_id, barter.user2_id];
      }

      // Randomly pick one of the possible owners
      const ownerId = faker.helpers.arrayElement(possibleOwners);

      await prisma.message.create({
        data: {
          content: faker.lorem.sentence(), // Random message content
          owner_id: ownerId, // UUID as a string
          status: faker.helpers.arrayElement(['sent', 'seen']), // Random status
          chat_id: chat.id, // UUID as a string
          timestamp: faker.date.recent(), // Recent timestamp
        },
      });
    }),
  );

  console.log('Messages seeded successfully.');
};

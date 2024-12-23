import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const seedRatings = async (prisma: PrismaClient) => {
  console.log('Seeding Ratings...');

  // Fetch all users, barters, and brokers to create valid ratings
  const users = await prisma.user.findMany();
  const barters = await prisma.barter.findMany();

  // Fetch broker user type id
  const brokerUserType = await prisma.userType.findFirst({
    where: { type: 'broker' },
  });

  if (!brokerUserType) {
    throw new Error('Broker user type not found.');
  }

  // Fetch all users who are brokers
  const brokers = await prisma.user.findMany({
    where: {
      user_type_id: brokerUserType.id,
    },
  });

  if (users.length < 1 || (barters.length < 1 && brokers.length < 1)) {
    throw new Error('Not enough users, barters, or brokers to create ratings.');
  }

  // Generate random ratings
  await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      // Randomly select a user to write the rating
      const wroteByUser = faker.helpers.arrayElement(users);

      // Randomly decide whether the rating is for a broker or barter
      const isBrokerRating = faker.datatype.boolean();

      let brokerId: string | null = null; // Ensure UUID handling for brokerId
      let barterId: string | null = null; // Ensure UUID handling for barterId

      if (isBrokerRating) {
        // If it's a broker rating, pick a random broker
        brokerId = faker.helpers.arrayElement(brokers)?.id ?? null;
      } else {
        // If it's a barter rating, pick a random barter
        barterId = faker.helpers.arrayElement(barters)?.id ?? null;
      }

      // Rating value between 1 and 5
      const ratingValue = faker.number.int({ min: 1, max: 5 });

      await prisma.rating.create({
        data: {
          value: ratingValue,
          description: faker.lorem.sentence(),
          wrote_by: wroteByUser.id, // UUID as string
          broker_id: brokerId, // UUID as string, can be null
          barter_id: barterId, // UUID as string, can be null
          created_at: faker.date.past(), // Random creation date
        },
      });
    }),
  );

  console.log('Ratings seeded successfully.');
};

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const seedMeetups = async (prisma: PrismaClient) => {
  console.log('Seeding Meetups...');

  // Fetch locations to associate with the meetup
  const locations = await prisma.location.findMany();

  if (locations.length === 0) {
    throw new Error('Not enough locations to create meetups.');
  }

  // Generate random meetups
  await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      const location = faker.helpers.arrayElement(locations);

      const meetupStatus = faker.helpers.arrayElement([
        'scheduled',
        'verified',
        'completed',
      ]);

      await prisma.meetup.create({
        data: {
          user1_key: faker.string.uuid(), // Random unique string for user1 QR key
          user2_key: faker.string.uuid(), // Random unique string for user2 QR key
          status: meetupStatus,
          location_id: location.id.toString(), // Ensure the ID is treated as a string
          created_at: faker.date.past(), // Random creation date
        },
      });
    }),
  );

  console.log('Meetups seeded successfully.');
};

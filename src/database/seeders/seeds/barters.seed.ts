import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const seedBarters = async (prisma: PrismaClient) => {
  console.log('Seeding Barters...');

  // Fetch users and items to associate with the barter
  const users = await prisma.user.findMany();
  const items = await prisma.item.findMany();
  const meetups = await prisma.meetup.findMany(); // If you want to associate meetups

  if (users.length < 2 || items.length < 2) {
    throw new Error('Not enough users or items to create barters.');
  }

  // Generate random barters
  await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      const user1 = faker.helpers.arrayElement(users);
      const user2 = faker.helpers.arrayElement(
        users.filter((user) => user.id !== user1.id),
      ); // Ensure user1 and user2 are different

      const user1Item = faker.helpers.arrayElement(items);
      const user2Item = faker.helpers.arrayElement(
        items.filter((item) => item.id !== user1Item.id),
      ); // Ensure items are different

      const barterStatus = faker.helpers.arrayElement([
        'ongoing',
        'aborted',
        'completed',
      ]);
      const completedAt =
        barterStatus === 'completed' ? faker.date.past() : null; // Only set completed_at if barter is completed
      const meetupId = faker.helpers.arrayElement(meetups)?.id ?? null; // Randomly pick a meetup ID (if any)

      await prisma.barter.create({
        data: {
          user1_id: user1.id.toString(),
          user2_id: user2.id.toString(),
          user1_item_id: user1Item.id.toString(),
          user2_item_id: user2Item.id.toString(),
          handled_by_ai: faker.helpers.arrayElement([
            'user1',
            'user2',
            'both',
            'none',
          ]), // Random enum value
          status: barterStatus,
          completed_at: completedAt,
          meetup_id: meetupId ? meetupId.toString() : null,
          created_at: faker.date.past(), // Random creation date
        },
      });
    }),
  );

  console.log('Barters seeded successfully.');
};

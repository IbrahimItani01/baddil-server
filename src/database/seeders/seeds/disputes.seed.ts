import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const seedDisputes = async (prisma: PrismaClient) => {
  console.log('Seeding Disputes...');

  // Fetch user types for admin and barterer
  const userTypes = await prisma.userType.findMany({
    where: {
      type: {
        in: ['admin', 'barterer'], // Ensure we only fetch admin and barterer types
      },
    },
  });

  const adminType = userTypes.find((type) => type.type === 'admin');
  const bartererType = userTypes.find((type) => type.type === 'barterer');

  if (!adminType || !bartererType) {
    throw new Error('Admin or Barterer user types not found.');
  }

  // Fetch users based on user type (admin and barterer)
  const admins = await prisma.user.findMany({
    where: {
      user_type_id: adminType.id.toString(), // Ensure user_type_id is a string
    },
  });

  const barterers = await prisma.user.findMany({
    where: {
      user_type_id: bartererType.id.toString(), // Ensure user_type_id is a string
    },
  });

  if (admins.length < 1 || barterers.length < 2) {
    throw new Error('Not enough admins or barterers to create disputes.');
  }

  // Generate random disputes
  await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      const user1 = faker.helpers.arrayElement(barterers); // Random user1 (barterer type)
      const user2 = faker.helpers.arrayElement(
        barterers.filter((user) => user.id !== user1.id),
      ); // Ensure user1 and user2 are different
      const admin = faker.helpers.arrayElement(admins); // Random admin (admin type)

      const disputeStatus = faker.helpers.arrayElement(['ongoing', 'resolved']);
      const resolvedAt =
        disputeStatus === 'resolved' ? faker.date.past() : null;

      await prisma.dispute.create({
        data: {
          admin_id: admin.id.toString(), // Ensure admin_id is a string
          user1_id: user1.id.toString(), // Ensure user1_id is a string
          user2_id: user2.id.toString(), // Ensure user2_id is a string
          details: faker.lorem.sentence(),
          status: disputeStatus,
          resolved_at: resolvedAt,
          created_at: faker.date.past(), // Random creation date
        },
      });
    }),
  );

  console.log('Disputes seeded successfully.');
};

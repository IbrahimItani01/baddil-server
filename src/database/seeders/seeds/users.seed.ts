import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const seedUsers = async (prisma: PrismaClient) => {
  console.log('Seeding Users...');

  // Fetch user types, user statuses, and settings
  const userTypes = await prisma.userType.findMany();
  const userStatuses = await prisma.userStatus.findMany();
  const settings = await prisma.setting.findMany();

  // Ensure that each field (user_type_id, user_status_id, settings_id) expects UUIDs
  await Promise.all(
    Array.from({ length: 20 }).map(() =>
      prisma.user.create({
        data: {
          profile_picture: faker.image.avatar(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          firebase_uid: faker.string.uuid(), // Random UUID for firebase_uid
          device_token: faker.string.uuid(), // Random UUID for device_token
          user_type_id: faker.helpers.arrayElement(userTypes).id, // Ensure this is a UUID
          user_status_id: faker.helpers.arrayElement(userStatuses).id, // Ensure this is a UUID
          settings_id: faker.helpers.arrayElement(settings).id, // Ensure this is a UUID
        },
      }),
    ),
  );

  console.log('Users seeded successfully.');
};

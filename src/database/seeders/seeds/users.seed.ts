import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export const seedUsers = async () => {
  console.log('Seeding Users...');
  const userTypes = await prisma.userType.findMany();
  const userStatuses = await prisma.userStatus.findMany();
  const settings = await prisma.setting.findMany();

  await Promise.all(
    Array.from({ length: 20 }).map(() =>
      prisma.user.create({
        data: {
          profile_picture: faker.image.avatar(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          firebase_uid: faker.string.uuid(), // Updated to faker.string.uuid()
          device_token: faker.string.uuid(), // Updated to faker.string.uuid()
          user_type_id: faker.helpers.arrayElement(userTypes).id,
          user_status_id: faker.helpers.arrayElement(userStatuses).id,
          settings_id: faker.helpers.arrayElement(settings).id,
        },
      }),
    ),
  );
};

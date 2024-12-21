import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedUserTypes = async () => {
  console.log('Seeding User Types...');
  const types = ['admin', 'broker', 'barterer'];

  await Promise.all(
    types.map((type) =>
      prisma.userType.create({
        data: { type },
      }),
    ),
  );
};

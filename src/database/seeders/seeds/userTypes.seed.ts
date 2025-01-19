import { PrismaClient } from '@prisma/client';

export const seedUserTypes = async (prisma: PrismaClient) => {
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

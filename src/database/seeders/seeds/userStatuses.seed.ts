import { PrismaClient } from '@prisma/client';

export const seedUserStatuses = async (prisma: PrismaClient) => {
  console.log('Seeding User Statuses...');
  const statuses = ['active', 'flagged', 'banned'];

  await Promise.all(
    statuses.map((status) =>
      prisma.userStatus.create({
        data: { status },
      }),
    ),
  );
};

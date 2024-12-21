import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedUserStatuses = async () => {
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

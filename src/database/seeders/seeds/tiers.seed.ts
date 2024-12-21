import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedTiers = async () => {
  console.log('Seeding Tiers...');
  const tiers = [
    { name: 'Bronze', requirement: 10 },
    { name: 'Silver', requirement: 50 },
    { name: 'Gold', requirement: 100 },
  ];

  await Promise.all(
    tiers.map((tier) =>
      prisma.tier.create({
        data: tier,
      }),
    ),
  );
};

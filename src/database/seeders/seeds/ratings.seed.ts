import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export const seedRatings = async () => {
  console.log('Seeding Ratings...');

  // Fetch all users, barters, and brokers to create valid ratings
  const users = await prisma.user.findMany();
  const barters = await prisma.barter.findMany();

  // Fetch broker user type id
  const brokerUserType = await prisma.userType.findFirst({
    where: { type: 'broker' },
  });
  

  if (!brokerUserType) {
    throw new Error('Broker user type not found.');
  }

  // Fetch all users who are brokers
  const brokers = await prisma.user.findMany({
    where: {
      user_type_id: brokerUserType.id,
    },
  });

  if (users.length < 1 || (barters.length < 1 && brokers.length < 1)) {
    throw new Error('Not enough users, barters, or brokers to create ratings.');
  }


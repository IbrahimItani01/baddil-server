import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export const seedHires = async () => {
  console.log('Seeding Hires...');

  // Fetch user types for broker and barterer
  const userTypes = await prisma.userType.findMany({
    where: {
      type: {
        in: ['broker', 'barterer'], // Ensure we only fetch broker and barterer types
      },
    },
  });

  const brokerType = userTypes.find((type) => type.type === 'broker');
  const bartererType = userTypes.find((type) => type.type === 'barterer');

  if (!brokerType || !bartererType) {
    throw new Error('Broker or Barterer user types not found.');
  }

  // Fetch users based on user type (broker or barterer)
  const brokers = await prisma.user.findMany({
    where: {
      user_type_id: brokerType.id,
    },
  });

  const barterers = await prisma.user.findMany({
    where: {
      user_type_id: bartererType.id,
    },
  });

  // Fetch all items to create valid hires
  const items = await prisma.item.findMany();

  if (brokers.length < 1 || barterers.length < 1 || items.length < 1) {
    throw new Error('Not enough brokers, barterers, or items to create hires.');
  }

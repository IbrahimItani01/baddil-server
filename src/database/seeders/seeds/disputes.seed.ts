import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export const seedDisputes = async () => {
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
      user_type_id: adminType.id,
    },
  });

  const barterers = await prisma.user.findMany({
    where: {
      user_type_id: bartererType.id,
    },
  });

  if (admins.length < 1 || barterers.length < 2) {
    throw new Error('Not enough admins or barterers to create disputes.');
  }


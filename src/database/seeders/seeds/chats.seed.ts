import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const seedChats = async (prisma: PrismaClient) => {
  console.log('Seeding Chats...');

  // Fetch some existing Barters and Hires
  const barters = await prisma.barter.findMany();
  const hires = await prisma.hire.findMany();

  if (barters.length < 1 && hires.length < 1) {
    throw new Error('Not enough barters or hires to create chats.');
  }

  // Generate random chats
  await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      // Randomly choose between a Barter or Hire for each chat
      const isBarter = faker.datatype.boolean();

      let barterId: string | null = null;
      let hireId: string | null = null;

      if (isBarter && barters.length > 0) {
        const barter = faker.helpers.arrayElement(barters);
        barterId = barter.id.toString(); // Ensure barter_id is a string
      } else if (!isBarter && hires.length > 0) {
        const hire = faker.helpers.arrayElement(hires);
        hireId = hire.id.toString(); // Ensure hire_id is a string
      }

      // Ensure only one of the ids is populated (barter_id or hire_id, not both)
      await prisma.chat.create({
        data: {
          barter_id: barterId ?? undefined, // Only set if not null
          hire_id: hireId ?? undefined, // Only set if not null
        },
      });
    }),
  );

  console.log('Chats seeded successfully.');
};

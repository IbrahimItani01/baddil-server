import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const seedExpenses = async (prisma: PrismaClient) => {
  console.log('Seeding Expenses...');
  await Promise.all(
    Array.from({ length: 50 }).map(() =>
      prisma.expense.create({
        data: {
          amount: parseFloat(
            faker.finance.amount({ min: 100, max: 5000, dec: 2 }),
          ),
          description: faker.commerce.productDescription(),
          expense_type: faker.helpers.arrayElement([
            'salary',
            'broker_compensation',
            'other',
          ]),
          date: faker.date.past(),
        },
      }),
    ),
  );
};

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function seedProfits() {
  const profits = Array.from({ length: 10 }).map(() => ({
    amount: parseFloat(faker.finance.amount({ min: 100, max: 10000, dec: 2 })),
    source: faker.helpers.arrayElement(['subscription', 'hire_budget']),
    date: faker.date.past(),
  }));

  for (const profit of profits) {
    await prisma.profit.create({ data: profit });
  }
}

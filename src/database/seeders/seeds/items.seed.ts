import { ItemCondition, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export const seedItems = async () => {
  console.log('Seeding Items...');

  // Fetch categories, subcategories, locations, and wallets to associate with the items
  const categories = await prisma.category.findMany();
  const subcategories = await prisma.subcategory.findMany();
  const locations = await prisma.location.findMany();
  const wallets = await prisma.wallet.findMany();

  if (categories.length < 1 || subcategories.length < 1 || locations.length < 1 || wallets.length < 1) {
    throw new Error('Not enough categories, subcategories, locations, or wallets to create items.');
  }



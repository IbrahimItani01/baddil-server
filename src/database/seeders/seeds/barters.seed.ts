import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export const seedBarters = async () => {
  console.log('Seeding Barters...');

  // Fetch users and items to associate with the barter
  const users = await prisma.user.findMany();
  const items = await prisma.item.findMany();
  const meetups = await prisma.meetup.findMany();  // If you want to associate meetups

  if (users.length < 2 || items.length < 2) {
    throw new Error('Not enough users or items to create barters.');
  }


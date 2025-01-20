import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createDatabase() {
  try {
    console.log('Synchronizing database schema with Prisma...');

    // This will push the schema to the database
    await prisma.$executeRaw`CREATE DATABASE IF NOT EXISTS baddil_db`; // Change to your desired database name
    console.log('Database created or already exists.');

    console.log('Applying schema...');
    await prisma.$connect();
    await prisma.$executeRaw`USE baddil_db`;
    await prisma.$disconnect();

    console.log('Schema applied. Migration complete.');
  } catch (error) {
    console.error(
      'Error while creating the database or applying schema:',
      error,
    );
  } finally {
    await prisma.$disconnect();
  }
}

createDatabase()
  .then(() => {
    console.log('Database creation complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error creating the database:', err);
    process.exit(1);
  });

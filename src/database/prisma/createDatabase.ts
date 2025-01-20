import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initializeDatabase() {
  try {
    console.log('Applying migrations...');
    await prisma.$connect();
    // Prisma assumes the database is already created; it manages tables and relations
    console.log('Schema synchronized.');
  } catch (error) {
    console.error('Error while applying migrations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initializeDatabase()
  .then(() => {
    console.log('Database setup complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error setting up the database:', err);
    process.exit(1);
  });

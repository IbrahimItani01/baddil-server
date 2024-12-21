import { PrismaClient } from '@prisma/client';

export async function clearDatabase() {
  const prisma = new PrismaClient();

  try {
    console.log('🗑️ Clearing database...');

    await prisma.message.deleteMany();
    await prisma.chat.deleteMany();
    await prisma.rating.deleteMany();
    await prisma.barter.deleteMany();
    await prisma.hire.deleteMany();
    await prisma.item.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.meetup.deleteMany();
    await prisma.dispute.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.profit.deleteMany();
    await prisma.subcategory.deleteMany();
    await prisma.category.deleteMany();
    await prisma.feature.deleteMany();
    await prisma.subscriptionPlan.deleteMany();
    await prisma.tier.deleteMany();
    await prisma.user.deleteMany();
    await prisma.location.deleteMany();
    await prisma.setting.deleteMany();
    await prisma.userStatus.deleteMany();
    await prisma.userType.deleteMany();

    console.log('✅ Database cleared.');
  } catch (error) {
    console.error('❌ Error while clearing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

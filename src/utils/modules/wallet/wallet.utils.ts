import { PrismaClient } from '@prisma/client';

export async function getWalletIdByUserId(prisma: PrismaClient, userId: string): Promise<string> {
  const wallet = await prisma.wallet.findFirst({
    where: { owner_id: userId },
  });

  if (!wallet) {
    throw new Error('Wallet not found for the given user');
  }

  return wallet.id;
}
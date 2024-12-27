import { PrismaClient } from '@prisma/client'; // 🔌 Importing PrismaClient to interact with the database
import { BadRequestException } from '@nestjs/common'; // ❌ Importing BadRequestException to handle errors

// 🏦 Function to get a Wallet ID by User ID
export async function getWalletIdByUserId(
  prisma: PrismaClient, // 🔌 PrismaClient instance to interact with the database
  userId: string, // 🆔 User ID to find the wallet associated with it
): Promise<string> {
  // 🔍 Fetch the wallet associated with the given userId
  const wallet = await prisma.wallet.findFirst({
    where: { owner_id: userId }, // 📋 Searching for wallet by user ID
  });

  // ❌ If no wallet is found for the given user, throw an error with a clear message
  if (!wallet) {
    throw new BadRequestException('Wallet not found for the given user'); // 🚫 Error handling using NestJS' BadRequestException
  }

  // 🔄 Return the wallet ID if found
  return wallet.id;
}

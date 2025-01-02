import { PrismaClient } from '@prisma/client'; // 🔌 Importing PrismaClient to interact with the database
import { BadRequestException, NotFoundException } from '@nestjs/common'; // ❌ Importing BadRequestException to handle errors
import { PrismaService } from 'src/database/prisma.service';

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

// 🚀 function to check if item in the user's wallet
export async function checkItemInUserWallet(
  prisma: PrismaService,
  userId: string,
  itemId: string,
): Promise<void> {
  // Find the user's wallet
  const userWallet = await prisma.wallet.findFirst({
    where: { owner_id: userId },
  });

  if (!userWallet) {
    throw new NotFoundException('Wallet not found for the user'); // 🚫 Wallet not found
  }

  // Check if the item is in the user's wallet
  const item = await prisma.item.findFirst({
    where: {
      id: itemId,
      wallet_id: userWallet.id, // Ensure the item belongs to the user's wallet
    },
  });

  if (!item) {
    throw new BadRequestException('Item not found in user’s wallet'); // 🚫 Item not found in wallet
  }
}

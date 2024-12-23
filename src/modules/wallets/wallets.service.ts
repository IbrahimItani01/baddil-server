import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemCondition } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class WalletsService {
  constructor(private readonly prisma: PrismaService) {}

  async getItemDetails(walletId: string, itemId: string) {
    return await this.prisma.item.findFirst({
      where: { id: itemId, wallet_id: walletId },
      include: { images: true, category: true, subcategory: true, location: true },
    });
  }

  async getWalletItems(walletId: string) {
    return await this.prisma.item.findMany({
      where: { wallet_id: walletId },
      include: { images: true },
    });
  }

  async addItemToWallet(
     userId: string,
     itemData: {
       name: string;
       description: string;
       categoryId: string;
       subcategoryId: string;
       condition: ItemCondition; // Use the enum type
       locationId: string;
       value: number;
     },
   ) {
     // Check for an existing wallet or create one
     let wallet = await this.prisma.wallet.findFirst({
       where: { owner_id: userId },
     });
 
     if (!wallet) {
       wallet = await this.prisma.wallet.create({
         data: {
           owner_id: userId,
         },
       });
     }
 
     // Create a new item in the wallet
     const newItem = await this.prisma.item.create({
       data: {
         name: itemData.name,
         description: itemData.description,
         condition: itemData.condition, // Enum type ensures correctness
         value: itemData.value,
         category_id: itemData.categoryId, // Correct property for foreign key
         subcategory_id: itemData.subcategoryId, // Correct property for foreign key
         location_id: itemData.locationId, // Correct property for foreign key
         wallet_id: wallet.id, // Correct property for foreign key
       },
     });
 
     return newItem;
   }

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
   
   async saveItemImage(itemId: string, filePath: string) {
    const image = await this.prisma.itemImage.create({
      data: {
        item_id: itemId,
        path: filePath,
      },
    });
    return image;
  }
  async updateWalletItem(walletId: string, itemId: string, updateDetails: any) {
    const { images, ...rest } = updateDetails;

    if (images) {
      await this.prisma.itemImage.deleteMany({ where: { item_id: itemId } });
      await this.prisma.itemImage.createMany({
        data: images.map((path) => ({ path, item_id: itemId })),
      });
    }

    return await this.prisma.item.update({
      where: { id: itemId },
      data: rest,
    });
  }

async deleteItemFromWallet(userId: string, itemId: string) {
    // Fetch the item to ensure it belongs to the user and retrieve associated images
    const item = await this.prisma.item.findFirst({
      where: { id: itemId, wallet: { owner_id: userId } },
      include: { images: true }, // Fetch associated images
    });

    if (!item) {
      throw new NotFoundException('Item not found or does not belong to the user');
    }

    // Delete images from storage
    const imagePaths = item.images.map((image) => image.path);
    imagePaths.forEach((imagePath) => {
      const absolutePath = path.join(__dirname, '..', imagePath);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath); // Remove the image file
      }
    });

    // Delete the item and its images from the database
    await this.prisma.$transaction([
      this.prisma.itemImage.deleteMany({ where: { item_id: itemId } }),
      this.prisma.item.delete({ where: { id: itemId } }),
    ]);

    return { itemId, deletedImages: imagePaths.length };
  }
}

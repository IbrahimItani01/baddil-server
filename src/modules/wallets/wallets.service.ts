/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { CreateItemDto, UpdateItemDto } from './dto/wallets.dto'; // 📝 Import the DTOs
import { handleError } from 'src/utils/general/error.utils';

@Injectable()
export class WalletsService {
  constructor(private readonly prisma: PrismaService) {}

  // 🛒 Fetch item details by walletId and itemId
  async getItemDetails(itemId: string) {
    try {
      const item = await this.prisma.item.findFirst({
        where: { id: itemId },
        include: {
          category: true,
          subcategory: true,
          location: true,
        },
      });

      if (!item) {
        throw new NotFoundException('Item not found');
      }

      return item;
    } catch (error) {
      handleError(error, 'Failed to fetch item details');
    }
  }

  // 📦 Fetch all items in a wallet
  async getWalletItems(walletId: string) {
    try {
      return await this.prisma.item.findMany({
        where: { wallet_id: walletId },
      });
    } catch (error) {
      handleError(error, 'Failed to fetch wallet items');
    }
  }

  // 📝 Add a new item to a wallet
  async addItemToWallet(
    userId: string,
    itemData: CreateItemDto, // 🎯 Use the CreateItemDto for validation
  ) {
    try {
      // 🔍 Check if wallet exists, or create a new one
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

      // 🆕 Create a new item in the wallet
      const newItem = await this.prisma.item.create({
        data: {
          name: itemData.name,
          description: itemData.description,
          condition: itemData.condition,
          value: 0,
          category_id: itemData.categoryId,
          subcategory_id: itemData.subcategoryId,
          location_id: itemData.locationId,
          wallet_id: wallet.id,
        },
      });

      return newItem; // 🎉 Return the newly created item
    } catch (error) {
      handleError(error, 'Failed to add item to wallet');
    }
  }

  // 🖼️ Save an image for an item
  async saveItemImage(itemId: string, filePath: string) {
    try {
      // 📸 Creating a new item image record in the database
      const image = await this.prisma.itemImage.create({
        data: {
          item_id: itemId,
          path: filePath,
        },
      });

      return image;
    } catch (error) {
      handleError(error, 'Failed to save item image');
    }
  }

  // ✏️ Update details of an item in the wallet
  async updateWalletItem(
    walletId: string,
    itemId: string,
    updateDetails: UpdateItemDto, // 🎯 Use the UpdateItemDto for validation
  ) {
    const { images, ...rest } = updateDetails;

    try {
      if (images) {
        // 🖼️ Handle image updates: delete existing images and create new ones
        await this.prisma.itemImage.deleteMany({ where: { item_id: itemId } });
        await this.prisma.itemImage.createMany({
          data: images.map((path) => ({ path, item_id: itemId })),
        });
      }

      // 📝 Updating the rest of the item details
      return await this.prisma.item.update({
        where: { id: itemId },
        data: rest,
      });
    } catch (error) {
      handleError(error, 'Failed to update item in wallet');
    }
  }

  // 🗑️ Delete an item from the wallet
  async deleteItemFromWallet(userId: string, itemId: string) {
    try {
      // 🔍 Fetch the item to ensure it belongs to the user
      const item = await this.prisma.item.findFirst({
        where: { id: itemId, wallet: { owner_id: userId } },
        include: { images: true },
      });

      if (!item) {
        throw new NotFoundException(
          'Item not found or does not belong to the user',
        );
      }

      // 🖼️ Delete images from file storage
      const imagePaths = item.images.map((image) => image.path);
      imagePaths.forEach((imagePath) => {
        const absolutePath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath);
        }
      });

      // 🗑️ Delete the item and its images from the database
      await this.prisma.$transaction([
        this.prisma.itemImage.deleteMany({ where: { item_id: itemId } }),
        this.prisma.item.delete({ where: { id: itemId } }),
      ]);

      return { itemId, deletedImages: imagePaths.length };
    } catch (error) {
      handleError(error, 'Failed to delete item from wallet');
    }
  }

  // 📝 get the item images
  async getItemImages(itemId: string): Promise<string[]> {
    try {
      const item = await this.prisma.item.findUnique({
        where: { id: itemId },
        include: {
          images: true,
        },
      });

      if (!item) {
        throw new NotFoundException('Item not found');
      }

      // Construct URLs for the images and fix slashes
      return item.images.map(
        (image) => `${process.env.BASE_URL}/${image.path.replace(/\\/g, '/')}`, // Replace backslashes with forward slashes
      );
    } catch (error) {
      handleError(error, 'failed to get item images');
    }
  }
  // 📦 Fetch all items not owned by the current user
  async getItemsNotOwnedByUser(userId: string) {
    try {
      return await this.prisma.item.findMany({
        where: {
          wallet: {
            owner_id: {
              not: userId, // Filter items where the owner ID is not the current user
            },
          },
        },
        include: {
          wallet: {
            include: {
              owner: {
                select: {
                  email: true, // Include the email of the item owner
                },
              },
            },
          },
        },
      });
    } catch (error) {
      handleError(error, 'Failed to fetch items not owned by the user');
    }
  }
  
}

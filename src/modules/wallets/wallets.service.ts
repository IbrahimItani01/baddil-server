import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'; // 🛠️ Importing necessary exceptions
import { ItemCondition } from '@prisma/client'; // 🔄 Importing the ItemCondition enum for item condition validation
import { PrismaService } from 'src/database/prisma.service'; // 📦 Importing the Prisma service to interact with the database
import * as fs from 'fs'; // 🗂️ Importing the file system module for image file management
import * as path from 'path'; // 🔍 Importing the path module to handle file paths

@Injectable()
export class WalletsService {
  constructor(private readonly prisma: PrismaService) {} // 🔧 Injecting Prisma service into the WalletsService

  // 🛒 Fetch item details by walletId and itemId
  async getItemDetails(walletId: string, itemId: string) {
    try {
      const item = await this.prisma.item.findFirst({
        where: { id: itemId, wallet_id: walletId }, // ⛓️ Matching the wallet and item
        include: {
          images: true,
          category: true,
          subcategory: true,
          location: true,
        }, // 📸 Including related information
      });

      if (!item) {
        throw new NotFoundException('Item not found'); // ❌ Item not found, throw error
      }

      return item;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Failed to fetch item details'); // ⚠️ Error fetching item details
    }
  }

  // 📦 Fetch all items in a wallet
  async getWalletItems(walletId: string) {
    try {
      return await this.prisma.item.findMany({
        where: { wallet_id: walletId }, // ⛓️ Matching the wallet
        include: { images: true }, // 📸 Including images for each item
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Failed to fetch wallet items'); // ⚠️ Error fetching wallet items
    }
  }

  // 📝 Add a new item to a wallet
  async addItemToWallet(
    userId: string,
    itemData: {
      name: string;
      description: string;
      categoryId: string;
      subcategoryId: string;
      condition: ItemCondition; // ✅ Enforcing the use of ItemCondition enum for condition
      locationId: string;
      value: number;
    },
  ) {
    try {
      // 🔍 Check if wallet exists, or create a new one
      let wallet = await this.prisma.wallet.findFirst({
        where: { owner_id: userId }, // ⛓️ Matching wallet by owner
      });

      if (!wallet) {
        wallet = await this.prisma.wallet.create({
          data: {
            owner_id: userId, // 📜 Creating wallet for the user if it doesn't exist
          },
        });
      }

      // 🆕 Create a new item in the wallet
      const newItem = await this.prisma.item.create({
        data: {
          name: itemData.name,
          description: itemData.description,
          condition: itemData.condition, // ✅ Using the enum ensures proper condition values
          value: itemData.value,
          category_id: itemData.categoryId, // 🗂️ Correct property for category foreign key
          subcategory_id: itemData.subcategoryId, // 🗂️ Correct property for subcategory foreign key
          location_id: itemData.locationId, // 🗺️ Correct property for location foreign key
          wallet_id: wallet.id, // ⛓️ Associating the item with the wallet
        },
      });

      return newItem; // 🎉 Return the newly created item
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Failed to add item to wallet'); // ⚠️ Error adding item to wallet
    }
  }

  // 🖼️ Save an image for an item
  async saveItemImage(itemId: string, filePath: string) {
    try {
      // 📸 Creating a new item image record in the database
      const image = await this.prisma.itemImage.create({
        data: {
          item_id: itemId,
          path: filePath, // 🛣️ Storing the file path of the image
        },
      });

      return image; // 🎉 Return the image details
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Failed to save item image'); // ⚠️ Error saving item image
    }
  }

  // ✏️ Update details of an item in the wallet
  async updateWalletItem(walletId: string, itemId: string, updateDetails: any) {
    const { images, ...rest } = updateDetails;

    try {
      if (images) {
        // 🖼️ Handle image updates: delete existing images and create new ones
        await this.prisma.itemImage.deleteMany({ where: { item_id: itemId } });
        await this.prisma.itemImage.createMany({
          data: images.map((path) => ({ path, item_id: itemId })), // 🛣️ Map the paths to new item images
        });
      }

      // 📝 Updating the rest of the item details
      return await this.prisma.item.update({
        where: { id: itemId }, // ⛓️ Finding the item by ID
        data: rest, // 📝 Updating the item with the new data
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Failed to update item in wallet'); // ⚠️ Error updating item details
    }
  }

  // 🗑️ Delete an item from the wallet
  async deleteItemFromWallet(userId: string, itemId: string) {
    try {
      // 🔍 Fetch the item to ensure it belongs to the user
      const item = await this.prisma.item.findFirst({
        where: { id: itemId, wallet: { owner_id: userId } }, // ⛓️ Ensure the item belongs to the user
        include: { images: true }, // 📸 Fetch associated images
      });

      if (!item) {
        throw new NotFoundException(
          'Item not found or does not belong to the user',
        ); // ❌ Item not found or unauthorized
      }

      // 🖼️ Delete images from file storage
      const imagePaths = item.images.map((image) => image.path);
      imagePaths.forEach((imagePath) => {
        const absolutePath = path.join(__dirname, '..', imagePath); // 🛣️ Resolving the absolute file path
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath); // 🗑️ Removing the image file from storage
        }
      });

      // 🗑️ Delete the item and its images from the database
      await this.prisma.$transaction([
        this.prisma.itemImage.deleteMany({ where: { item_id: itemId } }), // 🗑️ Deleting associated images
        this.prisma.item.delete({ where: { id: itemId } }), // 🗑️ Deleting the item itself
      ]);

      return { itemId, deletedImages: imagePaths.length }; // 🎉 Returning the item ID and the number of deleted images
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Failed to delete item from wallet'); // ⚠️ Error deleting the item
    }
  }
}

import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFiles,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { itemImagesUploadOptions } from 'src/utils/modules/config/file-upload.config';
import { ItemCondition } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { getWalletIdByUserId } from 'src/utils/modules/wallet/wallet.utils';

@UseGuards(JwtAuthGuard, UserTypeGuard) // 🔒 Apply guards to secure routes
@AllowedUserTypes('barterer') // ✅ Allow only specific user types
@Controller('wallet') // 📁 Route prefix for wallet-related endpoints
export class WalletsController {
  constructor(
    private readonly walletService: WalletsService,
    private readonly prisma: PrismaService, // 🔌 Inject PrismaService for utility functions
  ) {}

  /**
   * 🛒 Get item details by ID
   * @param req - Request object containing user details
   * @param itemId - ID of the item
   * @returns Item details
   */
  @Get('items/:itemId')
  async getItemDetails(@Req() req: any, @Param('itemId') itemId: string) {
    try {
      const walletId = await getWalletIdByUserId(this.prisma, req.user.id);
      const itemDetails = await this.walletService.getItemDetails(
        walletId,
        itemId,
      );
      if (!itemDetails) {
        throw new HttpException('Item not found', HttpStatus.NOT_FOUND); // ❌ Handle missing item
      }
      return {
        status: 'success',
        data: itemDetails,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch item details',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 🛍️ Get all wallet items for the user
   * @param req - Request object containing user details
   * @returns List of wallet items
   */
  @Get('items')
  async getWalletItems(@Req() req: any) {
    try {
      const walletId = await getWalletIdByUserId(this.prisma, req.user.id);
      const items = await this.walletService.getWalletItems(walletId);
      return {
        status: 'success',
        data: items,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch wallet items',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * ✨ Create a new item with images
   * @param req - Request object containing user details
   * @param itemData - Item details
   * @param files - Uploaded images
   * @returns Created item and image details
   */
  @Post('items')
  @UseInterceptors(FilesInterceptor('files', 5, itemImagesUploadOptions))
  async createItemWithImages(
    @Req() req: any,
    @Body()
    itemData: {
      name: string;
      description: string;
      categoryId: string;
      subcategoryId: string;
      condition: ItemCondition;
      locationId: string;
      value: number;
    },
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files uploaded'); // 🚫 Validate input
      }

      const newItem = await this.walletService.addItemToWallet(
        req.user.id,
        itemData,
      );

      const userId = req.user.id;
      req.itemId = newItem.id; // Pass itemId to file storage logic

      // Save image details in the database
      const savedImages = await Promise.all(
        files.map((file) => {
          const filePath = `/uploads/items-images/${userId}/${newItem.id}/${file.filename}`;
          return this.walletService.saveItemImage(newItem.id, filePath);
        }),
      );

      return {
        status: 'success',
        message: 'Item created and images uploaded successfully',
        data: {
          item: newItem,
          images: savedImages,
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create item',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * ✏️ Update wallet item details
   * @param req - Request object containing user details
   * @param itemId - ID of the item
   * @param updateDetails - Updated item details
   * @returns Updated item
   */
  @Put('items/:itemId')
  async updateWalletItem(
    @Req() req: any,
    @Param('itemId') itemId: string,
    @Body()
    updateDetails: {
      name?: string;
      description?: string;
      condition?: string;
      value?: number;
      images?: string[];
    },
  ) {
    try {
      const walletId = await getWalletIdByUserId(this.prisma, req.user.id);
      const updatedItem = await this.walletService.updateWalletItem(
        walletId,
        itemId,
        updateDetails,
      );
      if (!updatedItem) {
        throw new HttpException('Item not found', HttpStatus.NOT_FOUND); // ❌ Handle missing item
      }
      return {
        status: 'success',
        data: updatedItem,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update item',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 🗑️ Remove an item from the wallet
   * @param req - Request object containing user details
   * @param itemId - ID of the item
   * @returns Success message
   */
  @Delete('items/:itemId')
  async removeWalletItem(@Req() req: any, @Param('itemId') itemId: string) {
    try {
      const deleted = await this.walletService.deleteItemFromWallet(
        req.user.id,
        itemId,
      );
      if (!deleted) {
        throw new HttpException('Item not found', HttpStatus.NOT_FOUND); // ❌ Handle missing item
      }
      return {
        status: 'success',
        message: 'Item removed successfully',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to remove item',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

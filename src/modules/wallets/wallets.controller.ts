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
import { WalletsService } from './wallets.service'; // 📦 Import WalletsService to handle business logic
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔐 Import JwtAuthGuard to secure routes
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🛡️ Import UserTypeGuard for user type validation
import { FilesInterceptor } from '@nestjs/platform-express'; // 🗂️ Import FilesInterceptor for handling file uploads
import { itemImagesUploadOptions } from 'src/utils/modules/config/file-upload.config'; // 📁 Import file upload options for item images
import { PrismaService } from 'src/database/prisma.service'; // 🔌 Import PrismaService to interact with the database
import { getWalletIdByUserId } from 'src/utils/modules/wallet/wallet.utils'; // 💼 Utility function to get wallet by userId
import { CreateItemDto, UpdateItemDto } from './dto/wallets.dto'; // 📚 Import DTOs for data validation

@UseGuards(JwtAuthGuard, UserTypeGuard) // 🔒 Apply guards to secure routes
@AllowedUserTypes('barterer') // ✅ Allow only specific user types (barterers)
@Controller('wallet') // 📁 Route prefix for wallet-related endpoints
export class WalletsController {
  constructor(
    private readonly walletService: WalletsService, // 🔧 Injecting WalletsService to handle business logic
    private readonly prisma: PrismaService, // 🔌 Injecting PrismaService for utility functions
  ) {}

  // 🔍 Get details of a specific item by itemId
  @Get('items/:itemId')
  async getItemDetails(@Req() req: any, @Param('itemId') itemId: string) {
    try {
      const walletId = await getWalletIdByUserId(this.prisma, req.user.id); // 🏦 Get the walletId from userId
      const itemDetails = await this.walletService.getItemDetails(
        walletId,
        itemId,
      ); // 🛒 Fetch item details
      if (!itemDetails) {
        throw new HttpException('Item not found', HttpStatus.NOT_FOUND); // ❌ Item not found
      }
      return {
        status: 'success', // 🎉 Success response
        data: itemDetails, // 📝 Return item details
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch item details', // ⚠️ Error handling
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 🔍 Get all items in the wallet
  @Get('items')
  async getWalletItems(@Req() req: any) {
    try {
      const walletId = await getWalletIdByUserId(this.prisma, req.user.id); // 🏦 Get the walletId from userId
      const items = await this.walletService.getWalletItems(walletId); // 🛒 Fetch all wallet items
      return {
        status: 'success', // 🎉 Success response
        data: items, // 📝 Return all items in the wallet
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch wallet items', // ⚠️ Error handling
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ➕ Create a new item in the wallet with images
  @Post('items')
  @UseInterceptors(FilesInterceptor('files', 5, itemImagesUploadOptions)) // 🖼️ Handle file uploads with a max of 5 files
  async createItemWithImages(
    @Req() req: any, // 🛠️ Get the request object to access user details
    @Body() itemData: CreateItemDto, // 📝 Use the DTO for item creation
    @UploadedFiles() files: Express.Multer.File[], // 📸 Capture uploaded files (images)
  ) {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files uploaded'); // 🚫 Validate input: files should be present
      }

      const newItem = await this.walletService.addItemToWallet(
        req.user.id,
        itemData,
      ); // 🛒 Add item to wallet

      const userId = req.user.id;
      req.itemId = newItem.id; // 🆔 Store itemId for later use

      // 💾 Save image details in the database
      const savedImages = await Promise.all(
        files.map((file) => {
          const filePath = `/uploads/items-images/${userId}/${newItem.id}/${file.filename}`; // 📁 Save the file path
          return this.walletService.saveItemImage(newItem.id, filePath); // 🖼️ Save each image path in the database
        }),
      );

      return {
        status: 'success', // 🎉 Success response
        message: 'Item created and images uploaded successfully', // 📝 Success message
        data: {
          item: newItem, // 🛒 Newly created item
          images: savedImages, // 🖼️ Saved images for the item
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create item', // ⚠️ Error handling
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ✏️ Update an existing item in the wallet
  @Put('items/:itemId')
  async updateWalletItem(
    @Req() req: any, // 🛠️ Get the request object to access user details
    @Param('itemId') itemId: string, // 🆔 Get the itemId from the route parameters
    @Body() updateDetails: UpdateItemDto, // 📝 Use the DTO for updating items
  ) {
    try {
      const walletId = await getWalletIdByUserId(this.prisma, req.user.id); // 🏦 Get the walletId from userId
      const updatedItem = await this.walletService.updateWalletItem(
        walletId,
        itemId,
        updateDetails,
      ); // ✏️ Update the item
      if (!updatedItem) {
        throw new HttpException('Item not found', HttpStatus.NOT_FOUND); // ❌ Item not found
      }
      return {
        status: 'success', // 🎉 Success response
        data: updatedItem, // 📝 Return updated item details
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update item', // ⚠️ Error handling
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 🗑️ Remove an item from the wallet
  @Delete('items/:itemId')
  async removeWalletItem(@Req() req: any, @Param('itemId') itemId: string) {
    try {
      const deleted = await this.walletService.deleteItemFromWallet(
        req.user.id,
        itemId,
      ); // 🗑️ Delete the item from the wallet
      if (!deleted) {
        throw new HttpException('Item not found', HttpStatus.NOT_FOUND); // ❌ Item not found
      }
      return {
        status: 'success', // 🎉 Success response
        message: 'Item removed successfully', // 🗑️ Return a success message
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to remove item', // ⚠️ Error handling
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

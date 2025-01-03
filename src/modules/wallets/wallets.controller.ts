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
import { ApiResponse } from 'src/utils/api/apiResponse.interface';
import { validate } from 'class-validator';
import * as path from 'path';


@UseGuards(JwtAuthGuard, UserTypeGuard) // 🔒 Apply guards to secure routes
@Controller('wallet') // 📁 Route prefix for wallet-related endpoints
export class WalletsController {
  constructor(
    private readonly walletService: WalletsService, // 🔧 Injecting WalletsService to handle business logic
    private readonly prisma: PrismaService, // 🔌 Injecting PrismaService for utility functions
  ) {}

  // 🔍 Get details of a specific item by itemId
  @AllowedUserTypes('barterer') // ✅ Allow only specific user types (barterers)
  @Get('items/:itemId')
  async getItemDetails(
    @Req() req: any,
    @Param('itemId') itemId: string,
  ): Promise<ApiResponse> {
    const walletId = await getWalletIdByUserId(this.prisma, req.user.id); // 🏦 Get the walletId from userId
    const itemDetails = await this.walletService.getItemDetails(
      walletId,
      itemId,
    ); // 🛒 Fetch item details
    if (!itemDetails) {
      throw new HttpException('Item not found', HttpStatus.NOT_FOUND); // ❌ Item not found
    }
    return {
      success: true, // 🎉 Success response
      message: 'Item details fetched successfully',
      data: itemDetails, // 📝 Return item details
    };
  }

  // 🔍 Get all items in the wallet
  @AllowedUserTypes('barterer') // ✅ Allow only specific user types (barterers)
  @Get('items')
  async getWalletItems(@Req() req: any): Promise<ApiResponse> {
    const walletId = await getWalletIdByUserId(this.prisma, req.user.id); // 🏦 Get the walletId from userId
    const items = await this.walletService.getWalletItems(walletId); // 🛒 Fetch all wallet items
    return {
      success: true, // 🎉 Success response
      message: 'Wallet items fetched successfully',
      data: items, // 📝 Return all items in the wallet
    };
  }

  // ➕ Create a new item in the wallet with images
  @AllowedUserTypes('barterer') // ✅ Allow only specific user types (barterers)
  @Post('items')
  @UseInterceptors(FilesInterceptor('files', 5, itemImagesUploadOptions)) // 🖼️ Handle file uploads with a max of 5 files
  async createItemWithImages(
    @Req() req: any, // 🛠️ Get the request object to access user details
    @Body() rawBody: any, // 📝 Use raw body instead of strict DTO for flexibility
    @UploadedFiles() files: Express.Multer.File[], // 📸 Capture uploaded files (images)
  ): Promise<ApiResponse> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded'); // 🚫 Validate input: files should be present
    }

    if (files.length !== 5) {
      throw new BadRequestException('Exactly 5 images must be uploaded'); // 🚫 Validate: Must upload exactly 5 images
    }

    const userId = req.user.id;

    // 🛠️ Parse and validate form-data fields
    const itemData = new CreateItemDto();
    Object.assign(itemData, {
      name: rawBody.name,
      description: rawBody.description,
      categoryId: rawBody.categoryId,
      subcategoryId: rawBody.subcategoryId,
      condition: rawBody.condition,
      locationId: rawBody.locationId,
      value: parseFloat(rawBody.value), // 🔢 Convert string to number
    });

    const errors = await validate(itemData);
    if (errors.length > 0) {
      throw new BadRequestException(errors); // Throw validation errors
    }

    // 🛒 Add the item to the wallet
    const newItem = await this.walletService.addItemToWallet(userId, itemData);

    // 💾 Save image details in the database
    const savedImages = await Promise.all(
      files.map((file) =>
        this.walletService.saveItemImage(
          newItem.id,
          path.join('uploads', 'items-images', userId, file.filename),
        ),
      ),
    );

    return {
      success: true,
      message: 'Item created and 5 images uploaded successfully',
      data: {
        item: newItem,
        images: savedImages,
      },
    };
  }

  // ✏️ Update an existing item in the wallet
  @AllowedUserTypes('barterer') // ✅ Allow only specific user types (barterers)
  @Put('items/:itemId')
  async updateWalletItem(
    @Req() req: any, // 🛠️ Get the request object to access user details
    @Param('itemId') itemId: string, // 🆔 Get the itemId from the route parameters
    @Body() updateDetails: UpdateItemDto, // 📝 Use the DTO for updating items
  ): Promise<ApiResponse> {
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
      success: true, // 🎉 Success response
      message: 'Item updated successfully', // 📝 Success message
      data: updatedItem, // 📝 Return updated item details
    };
  }

  // 🗑️ Remove an item from the wallet
  @AllowedUserTypes('barterer') // ✅ Allow only specific user types (barterers)
  @Delete('items/:itemId')
  async removeWalletItem(
    @Req() req: any,
    @Param('itemId') itemId: string,
  ): Promise<ApiResponse> {
    const deleted = await this.walletService.deleteItemFromWallet(
      req.user.id,
      itemId,
    ); // 🗑️ Delete the item from the wallet
    if (!deleted) {
      throw new HttpException('Item not found', HttpStatus.NOT_FOUND); // ❌ Item not found
    }
    return {
      success: true, // 🎉 Success response
      message: 'Item removed successfully', // 🗑️ Return a success message
    };
  }
  @AllowedUserTypes('barterer') // ✅ Allow only specific user types (barterers)
  @Get('items/:itemId/images')
  async serveItemImages(@Param('itemId') itemId: string): Promise<ApiResponse> {
    const imageUrls = await this.walletService.getItemImages(itemId);

    return {
      success: true,
      message: 'Item images fetched successfully',
      data: imageUrls, // Send image URLs for the frontend to display
    };
  }
}

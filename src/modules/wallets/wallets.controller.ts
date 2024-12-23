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
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { itemImagesUploadOptions } from 'src/utils/modules/config/file-upload.config';
import { ItemCondition } from '@prisma/client';

@UseGuards(JwtAuthGuard, UserTypeGuard)
@AllowedUserTypes('barterer')
@Controller('wallet')
export class WalletsController {
  constructor(private readonly walletService: WalletsService) {}

  @Get(':walletId/items/:itemId')
  async getItemDetails(
    @Param('walletId') walletId: string,
    @Param('itemId') itemId: string,
  ) {
    return await this.walletService.getItemDetails(walletId, itemId);
  }

  @Get(':walletId/items')
  async getWalletItems(@Param('walletId') walletId: string) {
    return await this.walletService.getWalletItems(walletId);
  }
  
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
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    // Create the item and wallet (if not exists)
    const newItem = await this.walletService.addItemToWallet(
      req.user.id,
      itemData,
    );

    // Update the upload options to include itemId
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
  }

  @Put(':walletId/items/:itemId')
  async updateWalletItem(
    @Param('walletId') walletId: string,
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
    return await this.walletService.updateWalletItem(
      walletId,
      itemId,
      updateDetails,
    );
  }


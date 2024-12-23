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

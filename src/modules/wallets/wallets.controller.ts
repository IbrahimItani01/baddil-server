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


import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TiersService } from './tiers.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard';

@UseGuards(JwtAuthGuard, UserTypeGuard)
@AllowedUserTypes('barterer', 'admin')
@Controller('tiers')
export class TiersController {
  constructor(private readonly tiersService: TiersService) {}

  @Get('')
  async getBartererTier(@Request() req) {
    try {
      const userId = req.user.id; // Extracted from JWT
      const tierInfo = await this.tiersService.getBartererTier(userId);
      return {
        status: 'success',
        message: 'Tier and progress retrieved successfully',
        data: tierInfo,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve tier information',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


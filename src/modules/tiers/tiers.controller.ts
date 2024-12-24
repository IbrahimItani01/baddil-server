import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TiersService } from './tiers.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard';

@UseGuards(JwtAuthGuard, UserTypeGuard)
@Controller('tiers')
export class TiersController {
  constructor(private readonly tiersService: TiersService) {}

  @AllowedUserTypes('barterer', 'admin')
  @Get('user/:userId?')
  async getBartererTier(@Request() req, @Param('userId') bartererId?: string) {
    try {
      const userId = req.user.id ? req.user.id : bartererId; // Extracted from JWT
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

  @Put('')
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  @AllowedUserTypes('barterer')
  async updateBartererTier(@Body() body: { tierId: string }, @Request() req) {
    try {
      const userId = req.user.id; // Extracted from JWT
      const updatedTier = await this.tiersService.updateBartererTier(
        userId,
        body.tierId,
      );
      return {
        status: 'success',
        message: 'Tier updated successfully',
        data: updatedTier,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update tier information',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

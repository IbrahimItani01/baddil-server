import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { UserTypeGuard, AllowedUserTypes } from 'src/guards/userType.guard';

@UseGuards(JwtAuthGuard, UserTypeGuard)
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @AllowedUserTypes('barterer')
  @Post('broker')
  async addBrokerRating(
    @Request() req,
    @Body() body: { value: number; description: string; brokerId: string },
  ) {
    const userId = req.user.id;
    const { value, description, brokerId } = body;

    try {
      const rating = await this.ratingsService.addBrokerRating(
        userId,
        brokerId,
        value,
        description,
      );
      return {
        status: 'success',
        message: 'Broker rating added successfully',
        data: rating,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to add broker rating',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  @AllowedUserTypes('barterer')
  @Delete(':ratingId')
  async deleteRating(@Param('ratingId') ratingId: string) {
    try {
      await this.ratingsService.deleteRating(ratingId);
      return {
        status: 'success',
        message: 'Rating deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete rating',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @AllowedUserTypes('barterer','broker')
  @Post('barter')
  async addBarterRating(
    @Request() req,
    @Body() body: { value: number; description: string; barterId: string },
  ) {
    const userId = req.user.id;
    const { value, description, barterId } = body;

    try {
      const rating = await this.ratingsService.addBarterRating(
        userId,
        barterId,
        value,
        description,
      );
      return {
        status: 'success',
        message: 'Barter rating added successfully',
        data: rating,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to add barter rating',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

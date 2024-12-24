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
  

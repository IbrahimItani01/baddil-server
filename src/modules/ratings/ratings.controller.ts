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
import { AddBrokerRatingDto, AddBarterRatingDto } from './dto/ratings.dto'; // 🧳 Importing DTOs

@UseGuards(JwtAuthGuard, UserTypeGuard) // 🔒 Applying guards for authentication and user type validation
@Controller('ratings') // 📍 Base route for ratings
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {} // 🔧 Injecting RatingsService

  @AllowedUserTypes('barterer') // 👤 Only allow barterers to access this route
  @Post('broker') // ➕ Route to add a broker rating
  async addBrokerRating(
    @Request() req, // 📑 Request object to get user data
    @Body() body: AddBrokerRatingDto, // 🧳 Using DTO for validation of the incoming body
  ) {
    const userId = req.user.id; // 🆔 Extracting user ID from the request object

    try {
      const rating = await this.ratingsService.addBrokerRating(userId, body);
      return {
        status: 'success', // 🎉 Success status
        message: 'Broker rating added successfully', // 📢 Success message
        data: rating, // 📄 Return the created rating data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to add broker rating', // 🚫 Error message if failed
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal server error status
      );
    }
  }

  @AllowedUserTypes('barterer') // 👤 Only allow barterers to delete ratings
  @Delete(':ratingId') // 🗑️ Route to delete a rating by ID
  async deleteRating(@Param('ratingId') ratingId: string) {
    // 📑 Extracting rating ID from route params
    try {
      await this.ratingsService.deleteRating(ratingId); // 🧹 Deleting the rating from the service
      return {
        status: 'success', // 🎉 Success status
        message: 'Rating deleted successfully', // 📢 Success message
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete rating', // 🚫 Error message if failed
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal server error status
      );
    }
  }

  @AllowedUserTypes('barterer', 'broker') // 👤 Allow both barterers and brokers to access this route
  @Post('barter') // ➕ Route to add a barter rating
  async addBarterRating(
    @Request() req, // 📑 Request object to get user data
    @Body() body: AddBarterRatingDto, // 🧳 Using DTO for validation of the incoming body
  ) {
    const userId = req.user.id; // 🆔 Extracting user ID from the request object

    try {
      const rating = await this.ratingsService.addBarterRating(userId, body);
      return {
        status: 'success', // 🎉 Success status
        message: 'Barter rating added successfully', // 📢 Success message
        data: rating, // 📄 Return the created rating data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to add barter rating', // 🚫 Error message if failed
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal server error status
      );
    }
  }
}

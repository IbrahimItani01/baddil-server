import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { UserTypeGuard, AllowedUserTypes } from 'src/guards/userType.guard';
import { AddBrokerRatingDto, AddBarterRatingDto } from './dto/ratings.dto'; // 🧳 Importing DTOs
import { ApiResponse } from 'src/utils/api/apiResponse.interface';

@UseGuards(JwtAuthGuard, UserTypeGuard) // 🔒 Applying guards for authentication and user type validation
@Controller('ratings') // 📍 Base route for ratings
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {} // 🔧 Injecting RatingsService

  @AllowedUserTypes('barterer') // 👤 Only allow barterers to access this route
  @Post('broker') // ➕ Route to add a broker rating
  async addBrokerRating(
    @Request() req, // 📑 Request object to get user data
    @Body() body: AddBrokerRatingDto, // 🧳 Using DTO for validation of the incoming body
  ): Promise<ApiResponse> {
    const userId = req.user.id; // 🆔 Extracting user ID from the request object

    const rating = await this.ratingsService.addBrokerRating(userId, body);
    return {
      success: true,
      // 🎉 Success status
      message: 'Broker rating added successfully', // 📢 Success message
      data: rating, // 📄 Return the created rating data
    };
  }

  @AllowedUserTypes('barterer') // 👤 Only allow barterers to delete ratings
  @Delete(':ratingId') // 🗑️ Route to delete a rating by ID
  async deleteRating(
    @Param('ratingId') ratingId: string,
  ): Promise<ApiResponse> {
    // 📑 Extracting rating ID from route params

    await this.ratingsService.deleteRating(ratingId); // 🧹 Deleting the rating from the service
    return {
      success: true,
      // 🎉 Success status
      message: 'Rating deleted successfully', // 📢 Success message
    };
  }

  @AllowedUserTypes('barterer', 'broker') // 👤 Allow both barterers and brokers to access this route
  @Post('barter') // ➕ Route to add a barter rating
  async addBarterRating(
    @Request() req, // 📑 Request object to get user data
    @Body() body: AddBarterRatingDto, // 🧳 Using DTO for validation of the incoming body
  ): Promise<ApiResponse> {
    const userId = req.user.id; // 🆔 Extracting user ID from the request object

    const rating = await this.ratingsService.addBarterRating(userId, body);
    return {
      success: true,
      // 🎉 Success status
      message: 'Barter rating added successfully', // 📢 Success message
      data: rating, // 📄 Return the created rating data
    };
  }

  @AllowedUserTypes('barterer', 'broker', 'admin') // 🎯 Restricting access to specific user types
  @Get('barter/:barterId') // 📍 Endpoint to get ratings for a specific barter
  async getBarterRatings(
    @Param('barterId') barterId: string, // 📑 Extracting barterId from route params
  ): Promise<ApiResponse> {
    const ratings = await this.ratingsService.getBarterRatings(barterId); // 🔍 Fetching ratings for the barter
    return {
      success: true,
      message: 'Barter ratings retrieved successfully', // ✅ Success message
      data: ratings, // 🎉 Returning ratings data
    };
  }

}

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

// Applying guards to protect the routes
@UseGuards(JwtAuthGuard, UserTypeGuard)
@Controller('ratings') // Base route for ratings
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  /**
   * ➕ Add a rating for a broker
   * @param req - The request object containing user information.
   * @param body - The body of the request containing rating details.
   * @returns A success message and the created rating data.
   * @throws HttpException if the rating cannot be added.
   */
  @AllowedUserTypes('barterer') // Only allow barterers to access this route
  @Post('broker') // Route to add a broker rating
  async addBrokerRating(
    @Request() req,
    @Body() body: { value: number; description: string; brokerId: string },
  ) {
    const userId = req.user.id; // Extracting user ID from the request
    const { value, description, brokerId } = body; // Destructuring the body

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
      ); // Handling errors
    }
  }

  /**
   * 🗑️ Delete a rating
   * @param ratingId - The ID of the rating to delete.
   * @returns A success message upon deletion.
   * @throws HttpException if the rating cannot be deleted.
   */
  @AllowedUserTypes('barterer') // Only allow barterers to access this route
  @Delete(':ratingId') // Route to delete a rating by ID
  async deleteRating(@Param('ratingId') ratingId: string) {
    try {
      await this.ratingsService.deleteRating(ratingId); // Deleting the rating
      return {
        status: 'success',
        message: 'Rating deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete rating',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ); // Handling errors
    }
  }

  /**
   * ➕ Add a rating for a barter
   * @param req - The request object containing user information.
   * @param body - The body of the request containing rating details.
   * @returns A success message and the created rating data.
   * @throws HttpException if the rating cannot be added.
   */
  @AllowedUserTypes('barterer', 'broker') // Allow both barterers and brokers to access this route
  @Post('barter') // Route to add a barter rating
  async addBarterRating(
    @Request() req,
    @Body() body: { value: number; description: string; barterId: string },
  ) {
    const userId = req.user.id; // Extracting user ID from the request
    const { value, description, barterId } = body; // Destructuring the body

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
      ); // Handling errors
    }
  }
}

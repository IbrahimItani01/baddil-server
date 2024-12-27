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

// Applying guards to protect the routes
@UseGuards(JwtAuthGuard, UserTypeGuard)
@Controller('tiers') // Base route for tiers
export class TiersController {
  constructor(private readonly tiersService: TiersService) {} // Injecting TiersService

  /**
   * 📜 Get the tier information for a barterer
   * @param req - The request object containing user information.
   * @param bartererId - Optional ID of the barterer to retrieve tier information for.
   * @returns The tier information for the specified barterer.
   * @throws HttpException if the tier information cannot be retrieved.
   */
  @AllowedUserTypes('barterer', 'admin') // Allow barterers and admins to access this route
  @Get('user/:userId?') // Route to get barterer tier information
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
      ); // Handling errors
    }
  }

  /**
   * 📜 Evaluate and update the user's tier
   * @param req - The request object containing user information.
   * @returns The updated tier information.
   * @throws HttpException if the tier information cannot be updated.
   */
  @AllowedUserTypes('barterer') // Only allow barterers to access this route
  @Patch('user') // Route to evaluate and update user tier
  async evaluateAndUpdateUserTier(@Request() req) {
    try {
      const userId = req.user.id; // Extracted from JWT
      const result = await this.tiersService.evaluateAndUpdateUserTier(userId);
      return {
        status: 'success',
        message: result.message,
        data: result.updatedTier || null,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update tier information',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ); // Handling errors
    }
  }

  /**
   * ➕ Create a new tier
   * @param body - The body of the request containing tier details.
   * @returns The created tier information.
   * @throws HttpException if the tier cannot be created.
   */
  @AllowedUserTypes('admin') // Only allow admins to access this route
  @Post() // Route to create a new tier
  async createTier(@Body() body: { name: string; requirement: number }) {
    try {
      const tier = await this.tiersService.createTier(body);
      return {
        status: 'success',
        message: 'Tier created successfully',
        data: tier,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create tier',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ); // Handling errors
    }
  }

  /**
   * 📜 Get all tiers
   * @returns An array of all tiers.
   * @throws HttpException if the tiers cannot be retrieved.
   */
  @AllowedUserTypes('admin') // Only allow admins to access this route
  @Get() // Route to get all tiers
  async getTiers() {
    try {
      const tiers = await this.tiersService.getTiers();
      return {
        status: 'success',
        message: 'Tiers retrieved successfully',
        data: tiers,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve tiers',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ); // Handling errors
    }
  }

  /**
   * 📜 Update a specific tier
   * @param id - The ID of the tier to update.
   * @param body - The body of the request containing updated tier details.
   * @returns The updated tier information.
   * @throws HttpException if the tier cannot be updated.
   */
  @AllowedUserTypes('admin') // Only allow admins to access this route
  @Put(':id') // Route to update a specific tier
  async updateTier(
    @Param('id') id: string,
    @Body() body: { name?: string; requirement?: number },
  ) {
    try {
      const updatedTier = await this.tiersService.updateTier(id, body);
      return {
        status: 'success',
        message: 'Tier updated successfully',
        data: updatedTier,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update tier',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ); // Handling errors
    }
  }

  /**
   * 🗑️ Delete a specific tier
   * @param id - The ID of the tier to delete.
   * @returns A success message upon deletion.
   * @throws HttpException if the tier cannot be deleted.
   */
  @AllowedUserTypes('admin') // Only allow admins to access this route
  @Delete(':id') // Route to delete a specific tier
  async deleteTier(@Param('id') id: string) {
    try {
      await this.tiersService.deleteTier(id);
      return {
        status: 'success',
        message: 'Tier deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete tier',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ); // Handling errors
    }
  }
}

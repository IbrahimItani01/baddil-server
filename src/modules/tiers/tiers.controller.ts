import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TiersService } from './tiers.service'; // 🔧 Importing TiersService
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔒 Importing JWT guard for route protection
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🚦 Importing guards to check user types
import { CreateTierDto, UpdateTierDto } from './dto/tiers.dto'; // 🛠️ Importing DTOs
import { ApiResponse } from 'src/utils/api/apiResponse.interface';

@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Apply guards to protect the routes
@Controller('tiers') // 🚪 Base route for tiers
export class TiersController {
  constructor(private readonly tiersService: TiersService) {} // 🏗️ Injecting TiersService

  /**
   * 📜 Get the tier information for a barterer
   * @param req - The request object containing user information.
   * @param bartererId - Optional ID of the barterer to retrieve tier information for.
   * @returns The tier information for the specified barterer.
   * @throws HttpException if the tier information cannot be retrieved.
   */
  @AllowedUserTypes('barterer', 'admin') // 👥 Allow barterers and admins to access this route
  @Get('user/:userId?') // 📡 Route to get barterer tier information
  async getBartererTier(
    @Request() req,
    @Param('userId') bartererId?: string,
  ): Promise<ApiResponse> {
    const userId = req.user.id ? req.user.id : bartererId; // 🕵️‍♂️ Extracted user ID from JWT or parameter
    const tierInfo = await this.tiersService.getBartererTier(userId); // 🗂️ Fetching tier info from service
    return {
      success: true,
      message: 'Tier and progress retrieved successfully',
      data: tierInfo,
    };
  }

  /**
   * 📜 Evaluate and update the user's tier
   * @param req - The request object containing user information.
   * @returns The updated tier information.
   * @throws HttpException if the tier information cannot be updated.
   */
  @AllowedUserTypes('barterer') // 🏆 Only allow barterers to access this route
  @Patch('user') // ✍️ Route to evaluate and update user tier
  async evaluateAndUpdateUserTier(@Request() req): Promise<ApiResponse> {
    const userId = req.user.id; // 👤 Extract user ID from JWT
    const result = await this.tiersService.evaluateAndUpdateUserTier(userId); // 🔄 Update tier based on evaluation
    return {
      success: true,
      message: result.message,
      data: result.updatedTier || null,
    };
  }

  /**
   * ➕ Create a new tier
   * @param body - The body of the request containing tier details.
   * @returns The created tier information.
   * @throws HttpException if the tier cannot be created.
   */
  @AllowedUserTypes('admin') // 👑 Only allow admins to access this route
  @Post() // ➕ Route to create a new tier
  async createTier(@Body() body: CreateTierDto): Promise<ApiResponse> {
    // 📝 Use CreateTierDto for the body

    const tier = await this.tiersService.createTier(body); // 🏗️ Calling service to create tier
    return {
      success: true,
      message: 'Tier created successfully',
      data: tier,
    };
  }

  /**
   * 📜 Get all tiers
   * @returns An array of all tiers.
   * @throws HttpException if the tiers cannot be retrieved.
   */
  @AllowedUserTypes('admin') // 👑 Only allow admins to access this route
  @Get() // 📡 Route to get all tiers
  async getTiers(): Promise<ApiResponse> {
    const tiers = await this.tiersService.getTiers(); // 🗂️ Fetching all tiers
    return {
      success: true,
      message: 'Tiers retrieved successfully',
      data: tiers,
    };
  }

  /**
   * 📜 Update a specific tier
   * @param id - The ID of the tier to update.
   * @param body - The body of the request containing updated tier details.
   * @returns The updated tier information.
   * @throws HttpException if the tier cannot be updated.
   */
  @AllowedUserTypes('admin') // 👑 Only allow admins to access this route
  @Put(':id') // ✍️ Route to update a specific tier
  async updateTier(
    @Param('id') id: string,
    @Body() body: UpdateTierDto,
  ): Promise<ApiResponse> {
    // 📝 Use UpdateTierDto for the body

    const updatedTier = await this.tiersService.updateTier(id, body); // 🔄 Updating tier in service
    return {
      success: true,
      message: 'Tier updated successfully',
      data: updatedTier,
    };
  }

  /**
   * 🗑️ Delete a specific tier
   * @param id - The ID of the tier to delete.
   * @returns A success message upon deletion.
   * @throws HttpException if the tier cannot be deleted.
   */
  @AllowedUserTypes('admin') // 👑 Only allow admins to access this route
  @Delete(':id') // 🗑️ Route to delete a specific tier
  async deleteTier(@Param('id') id: string): Promise<ApiResponse> {
    await this.tiersService.deleteTier(id); // 🧹 Deleting tier through service
    return {
      success: true,
      message: 'Tier deleted successfully',
    };
  }
}

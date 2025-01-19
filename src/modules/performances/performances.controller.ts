import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards
import { PerformancesService } from './performances.service'; // 📈 Importing PerformancesService for business logic
import { Controller, Get, UseGuards, Request } from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard
import { ApiResponse } from 'src/utils/api/apiResponse.interface';

@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
@Controller('performance') // 📍 Base route for performance-related operations
export class PerformancesController {
  constructor(private readonly performancesService: PerformancesService) {} // 🏗️ Injecting PerformancesService

  /**
   * 📜 Get broker earnings
   * @param req - The request object containing user information.
   * @returns The earnings data for the broker.
   */
  @AllowedUserTypes('broker') // 🎯 Restricting access to brokers
  @Get('earnings') // 📥 Endpoint to get broker earnings
  async getBrokerEarnings(@Request() req: any): Promise<ApiResponse> {
    const brokerId = req.user.id; // Extract broker ID from JWT

    const earnings = await this.performancesService.getBrokerEarnings(brokerId); // �
    return {
      success: true,
      message: 'Earnings retrieved successfully',
      data: earnings,
    };
  }

  /**
   * 📜 Get broker barters grouped by status
   * @param req - The request object containing user information.
   * @returns The barters data for the broker.
   */
  @AllowedUserTypes('broker') // 🎯 Restricting access to brokers
  @Get('barters') // 📥 Endpoint to get broker barters
  async getBrokerBarters(@Request() req: any): Promise<ApiResponse> {
    const brokerId = req.user.id; // Extract broker ID from JWT

    const barters =
      await this.performancesService.getBrokerBartersGroupedByStatus(brokerId);
    return {
      success: true,
      message: 'Barters retrieved successfully',
      data: barters,
    };
  }

  /**
   * 📜 Get broker ratings
   * @param req - The request object containing user information.
   * @returns The ratings data for the broker.
   */
  @AllowedUserTypes('broker') // 🎯 Restricting access to brokers
  @Get('ratings') // 📥 Endpoint to get broker ratings
  async getBrokerRatings(@Request() req: any): Promise<ApiResponse> {
    const brokerId = req.user.id; // Extract broker ID from JWT

    const ratings = await this.performancesService.getBrokerRatings(brokerId);
    return {
      success: true,
      message: 'Ratings retrieved successfully',
      data: ratings,
    };
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { StatisticsService } from './statistics.service'; // 📊 Importing StatisticsService for business logic
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards
import { ApiResponse } from 'src/utils/api/apiResponse.interface';

@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
@AllowedUserTypes('admin') // 🎯 Restricting access to admin users
@Controller('statistics') // 📍 Base route for statistics-related operations
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {} // 🏗️ Injecting StatisticsService

  /**
   * 📜 Get User Counts
   * @returns The count of users in the system.
   */
  @Get('user-count') // 📥 Endpoint to get user counts
  async getUserCounts(): Promise<ApiResponse> {
    // 🎯 Returning the DTO as response type
    const counts = await this.statisticsService.getUserCounts(); // 🔍 Fetching user counts
    return {
      success: true,
      message: 'User counts fetched successfully',
      data: counts,
    }; // ✅ Return counts directly as the DTO
  }
}

import { BadRequestException, Controller, Get, UseGuards } from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { StatisticsService } from './statistics.service'; // 📊 Importing StatisticsService for business logic
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards
import { UserCountsDto } from './dto/statistics.dto'; // 📥 Importing the UserCountsDto

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
  async getUserCounts(): Promise<UserCountsDto> { // 🎯 Returning the DTO as response type
    try {
      const counts = await this.statisticsService.getUserCounts(); // 🔍 Fetching user counts
      return counts; // ✅ Return counts directly as the DTO
    } catch (error) {
      throw new BadRequestException(
        'Failed to retrieve user counts', // 🚫 Error message
        error.message, // 📜 Detailed error message
      );
    }
  }
}

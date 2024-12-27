import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards
import { PerformancesService } from './performances.service'; // 📈 Importing PerformancesService for business logic
import {
  Controller,
  Get,
  UseGuards,
  HttpException,
  HttpStatus,
  Request,
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard
import {
  BrokerEarningsDto,
  BrokerBartersDto,
  BrokerRatingsDto,
} from './dto/performances.dto'; // 📨 Importing DTOs

@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
@AllowedUserTypes('broker') // 🎯 Restricting access to brokers
@Controller('performance') // 📍 Base route for performance-related operations
export class PerformancesController {
  constructor(private readonly performancesService: PerformancesService) {} // 🏗️ Injecting PerformancesService

  /**
   * 📜 Get broker earnings
   * @param req - The request object containing user information.
   * @returns The earnings data for the broker.
   */
  @Get('earnings') // 📥 Endpoint to get broker earnings
  async getBrokerEarnings(@Request() req: any): Promise<BrokerEarningsDto> {
    const brokerId = req.user.id; // Extract broker ID from JWT
    try {
      return await this.performancesService.getBrokerEarnings(brokerId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve earnings', // 🚫 Error handling
        HttpStatus.INTERNAL_SERVER_ERROR, // 500 Internal Server Error
      );
    }
  }

  /**
   * 📜 Get broker barters grouped by status
   * @param req - The request object containing user information.
   * @returns The barters data for the broker.
   */
  @Get('barters') // 📥 Endpoint to get broker barters
  async getBrokerBarters(@Request() req: any): Promise<BrokerBartersDto> {
    const brokerId = req.user.id; // Extract broker ID from JWT
    try {
      return await this.performancesService.getBrokerBartersGroupedByStatus(
        brokerId,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve barters', // 🚫 Error handling
        HttpStatus.INTERNAL_SERVER_ERROR, // 500 Internal Server Error
      );
    }
  }

  /**
   * 📜 Get broker ratings
   * @param req - The request object containing user information.
   * @returns The ratings data for the broker.
   */
  @Get('ratings') // 📥 Endpoint to get broker ratings
  async getBrokerRatings(@Request() req: any): Promise<BrokerRatingsDto> {
    const brokerId = req.user.id; // Extract broker ID from JWT
    try {
      return await this.performancesService.getBrokerRatings(brokerId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve ratings', // 🚫 Error handling
        HttpStatus.INTERNAL_SERVER_ERROR, // 500 Internal Server Error
      );
    }
  }
}

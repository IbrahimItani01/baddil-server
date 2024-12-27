import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { BarterersService } from './barterers.service'; // 🤝 Importing BarterersService for business logic
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard
import { UserTypeGuard, AllowedUserTypes } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards

/**
 * 🛠️ Barterers Controller
 * Handles the operations related to barterers, such as fetching the information
 * for a specific barterer. Access is restricted to users with the "barterer" type.
 */
@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
@AllowedUserTypes('barterer') // Only allows "barterer" users to access this controller
@Controller('barterers') // 📍 Base route for barterer-related operations
export class BarterersController {
  constructor(private readonly barterersService: BarterersService) {} // 🏗️ Injecting BarterersService

  /**
   * 📑 Get Barterer Information
   * Fetches the information of the currently authenticated barterer.
   * @param req - The request object, which includes the user information from the JWT.
   * @returns The barterer's information or an error message if the operation fails.
   */
  @Get() // 📥 Endpoint to get barterer information
  async getBartererInfo(@Request() req) {
    try {
      // Fetch the barterer's information from the service using the user ID from the JWT
      const bartererInfo = await this.barterersService.getBartererInfo(
        req.user.id, // 🏷️ Accessing user ID from the request
      );
      return { success: true, data: bartererInfo }; // ✅ Return the barterer's data
    } catch (error) {
      // Handle any errors that occur and provide a meaningful response
      throw new HttpException(
        error.message || 'Failed to retrieve barterer information', // 🚫 Error message fallback
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }
}

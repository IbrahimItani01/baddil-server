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
import { BartererInfoDto } from './dto/barterers.dto'; // 📄 Importing the DTO for Barterer information

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
  async getBartererInfo(@Request() req): Promise<BartererInfoDto> {
    // Return type is the DTO
    try {
      // Fetch the barterer's information from the service using the user ID from the JWT
      const bartererInfo = await this.barterersService.getBartererInfo(
        req.user.id, // 🏷️ Accessing user ID from the request
      );
      return bartererInfo; // Return the barterer's data as a DTO
    } catch (error) {
      // Handle any errors that occur and provide a meaningful response
      throw new HttpException(
        error.message || 'Failed to retrieve barterer information', // 🚫 Error message fallback
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }
}

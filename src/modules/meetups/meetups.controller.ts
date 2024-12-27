import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { MeetupsService } from './meetups.service'; // 📅 Importing MeetupsService for business logic
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard

@Controller('meetups') // 📍 Base route for meetup-related operations
@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
@AllowedUserTypes('barterer', 'broker') // 🎯 Restricting access to barterers and brokers
export class MeetupsController {
  constructor(private readonly meetupsService: MeetupsService) {} // 🏗️ Injecting MeetupsService

  /**
   * ➕ Create a new meetup
   * @param user1Key - The key of the first user.
   * @param user2Key - The key of the second user.
   * @param locationId - The ID of the location for the meetup.
   * @returns The created meetup record.
   */
  @Post('create') // ➕ Endpoint to create a meetup
  async createMeetup(
    @Body('user1Key') user1Key: string,
    @Body('user2Key') user2Key: string,
    @Body('locationId') locationId: string,
  ) {
    try {
      const meetup = await this.meetupsService.createMeetup(
        user1Key,
        user2Key,
        locationId,
      );
      return {
        status: 'success',
        message: 'Meetup created successfully',
        data: meetup,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to create meetup: ' + error.message,
        HttpStatus.BAD_REQUEST, // 400 Bad Request
      );
    }
  }

}

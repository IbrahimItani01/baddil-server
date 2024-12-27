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
import { CreateMeetupDto, VerifyMeetupDto } from './dto/meetups.dto'; // 📄 Importing DTOs
import { ApiResponse } from 'src/utils/api/apiResponse.interface';

@Controller('meetups') // 📍 Base route for meetup-related operations
@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
@AllowedUserTypes('barterer', 'broker') // 🎯 Restricting access to barterers and brokers
export class MeetupsController {
  constructor(private readonly meetupsService: MeetupsService) {} // 🏗️ Injecting MeetupsService

  /**
   * ➕ Create a new meetup
   * @param createMeetupDto - DTO containing the details of the meetup.
   * @returns The created meetup record.
   */
  @Post('create') // ➕ Endpoint to create a meetup
  async createMeetup(
    @Body() createMeetupDto: CreateMeetupDto,
  ): Promise<ApiResponse> {
    const meetup = await this.meetupsService.createMeetup(createMeetupDto);
    return {
      success: true,
      message: 'Meetup created successfully',
      data: meetup,
    };
  }

  /**
   * 📜 Verify a meetup
   * @param meetupId - The ID of the meetup to verify.
   * @param verifyMeetupDto - DTO containing the userKey to verify the meetup.
   * @returns The verification result.
   */
  @Post('verify/:meetupId') // ➕ Endpoint to verify a meetup
  async verifyMeetup(
    @Param('meetupId') meetupId: string,
    @Body() verifyMeetupDto: VerifyMeetupDto, // 📄 Using the VerifyMeetupDto
  ): Promise<ApiResponse> {
    const verificationResult = await this.meetupsService.verifyMeetup(
      meetupId,
      verifyMeetupDto,
    );
    return {
      success: true,
      message: 'Meetup verified successfully',
      data: verificationResult,
    };
  }

  /**
   * 📜 Get a meetup by ID
   * @param meetupId - The ID of the meetup to retrieve.
   * @returns The meetup record.
   */
  @Get(':meetupId') // 📥 Endpoint to get a specific meetup
  async getMeetupById(
    @Param('meetupId') meetupId: string,
  ): Promise<ApiResponse> {
    const meetup = await this.meetupsService.getMeetupById(meetupId);
    if (!meetup) {
      throw new HttpException('Meetup not found', HttpStatus.NOT_FOUND); // 404 Not Found
    }
    return {
      success: true,
      message: 'Meetup retrieved successfully',
      data: meetup,
    };
  }
}

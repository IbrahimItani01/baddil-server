import { Injectable, BadRequestException } from '@nestjs/common'; // 📦 Importing necessary exceptions
import { Meetup, MeetupStatus } from '@prisma/client'; // 📅 Importing Meetup and MeetupStatus types from Prisma
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access
import { CreateMeetupDto, VerifyMeetupDto } from './dto/meetups.dto'; // 🧾 Importing DTOs
import { handleError } from 'src/utils/general/error.utils';
import { checkEntityExists } from 'src/utils/general/models.utils';

@Injectable()
export class MeetupsService {
  constructor(private readonly prisma: PrismaService) {} // 🏗️ Injecting PrismaService

  /**
   * ➕ Create a new meetup
   * @param createMeetupDto - The DTO containing data for creating a meetup.
   * @returns The created meetup record.
   * @throws InternalServerErrorException if there is an error creating the meetup.
   */
  async createMeetup(createMeetupDto: CreateMeetupDto): Promise<Meetup> {
    const { user1Key, user2Key, locationId } = createMeetupDto; // Destructure the DTO
    try {
      return await this.prisma.meetup.create({
        data: {
          user1_key: user1Key,
          user2_key: user2Key,
          location_id: locationId,
        },
      });
    } catch (error) {
      handleError(error, 'failed creating a meetup');
    }
  }

  /**
   * 📜 Verify a meetup
   * @param meetupId - The ID of the meetup to verify.
   * @param verifyMeetupDto - The DTO containing the userKey for verification.
   * @returns The verified meetup record.
   * @throws NotFoundException if the meetup is not found.
   * @throws BadRequestException if the user key does not match.
   */
  async verifyMeetup(
    meetupId: string,
    verifyMeetupDto: VerifyMeetupDto,
  ): Promise<Meetup> {
    const { userKey } = verifyMeetupDto; // Destructure the DTO

    try {
      // Check if the meetup exists
      const meetup = await checkEntityExists(this.prisma, 'meetup', meetupId);

      // Check if the userKey matches either user1_key or user2_key
      if (userKey === meetup.user1_key || userKey === meetup.user2_key) {
        // If both keys are verified, mark the meetup as completed
        await this.prisma.meetup.update({
          where: { id: meetupId },
          data: { status: MeetupStatus.completed },
        });
        return meetup; // Return the verified meetup
      }

      throw new BadRequestException('User key does not match'); // 🚫 Error handling for mismatched user key
    } catch (error) {
      handleError(error, 'Failed to verify meetup'); // Handle error with a custom message
    }
  }

  /**
   * 📜 Get a meetup by ID
   * @param meetupId - The ID of the meetup to retrieve.
   * @returns The meetup record.
   * @throws NotFoundException if the meetup is not found.
   */
  async getMeetupById(meetupId: string): Promise<Meetup> {
    try {
      const meetup = await checkEntityExists(this.prisma, 'meetup', meetupId);
      return meetup; // Return the found meetup
    } catch (error) {
      handleError(error, 'failed getting meetup');
    }
  }
}

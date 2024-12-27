import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common'; // 📦 Importing necessary exceptions
import { Meetup, MeetupStatus } from '@prisma/client'; // 📅 Importing Meetup and MeetupStatus types from Prisma
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

@Injectable()
export class MeetupsService {
  constructor(private readonly prisma: PrismaService) {} // 🏗️ Injecting PrismaService

  /**
   * ➕ Create a new meetup
   * @param user1Key - The key of the first user.
   * @param user2Key - The key of the second user.
   * @param locationId - The ID of the location for the meetup.
   * @returns The created meetup record.
   * @throws InternalServerErrorException if there is an error creating the meetup.
   */
  async createMeetup(
    user1Key: string,
    user2Key: string,
    locationId: string,
  ): Promise<Meetup> {
    try {
      return await this.prisma.meetup.create({
        data: {
          user1_key: user1Key,
          user2_key: user2Key,
          location_id: locationId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create meetup: ' + error.message,
      ); // 🚫 Error handling
    }
  }

  /**
   * 📜 Verify a meetup
   * @param meetupId - The ID of the meetup to verify.
   * @param userKey - The key of the user verifying the meetup.
   * @returns The verified meetup record.
   * @throws NotFoundException if the meetup is not found.
   * @throws BadRequestException if the user key does not match.
   */
  async verifyMeetup(meetupId: string, userKey: string): Promise<Meetup> {
    const meetup = await this.prisma.meetup.findUnique({
      where: { id: meetupId },
    });

    if (!meetup) {
      throw new NotFoundException('Meetup not found'); // 🚫 Error handling for not found
    }

    // Check if the userKey matches either user1_key or user2_key
    if (userKey === meetup.user1_key || userKey === meetup.user2_key) {
      // If both keys are verified, mark the meetup as completed
      await this.prisma.meetup.update({
        where: { id: meetupId },
        data: { status: MeetupStatus.completed },
      });
      return meetup; // Return the verified meetup
    }

    throw new BadRequestException('User  key does not match'); // 🚫 Error handling for mismatched user key
  }

  /**
   * 📜 Get a meetup by ID
   * @param meetupId - The ID of the meetup to retrieve.
   * @returns The meetup record.
   * @throws NotFoundException if the meetup is not found.
   */
  async getMeetupById(meetupId: string): Promise<Meetup> {
    const meetup = await this.prisma.meetup.findUnique({
      where: { id: meetupId },
    }); // 🔍 Fetching the meetup by ID
    if (!meetup) {
      throw new NotFoundException('Meetup not found'); // 🚫 Error handling for not found
    }
    return meetup; // Return the found meetup
  }
}

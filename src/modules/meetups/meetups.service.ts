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


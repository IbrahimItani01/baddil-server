import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'; // 📦 Importing necessary exceptions
import { Location } from '@prisma/client'; // 📍 Importing Location type from Prisma
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {} // 🏗️ Injecting PrismaService

  /**
   * ➕ Create a new location
   * @param name - The name of the location.
   * @param longitude - The longitude of the location.
   * @param latitude - The latitude of the location.
   * @returns The created location record.
   * @throws InternalServerErrorException if there is an error creating the location.
   */
  async createLocation(
    name: string,
    longitude: number,
    latitude: number,
  ): Promise<Location> {
    try {
      return await this.prisma.location.create({
        data: {
          name,
          longitude,
          latitude,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create location: ' + error.message,
      ); // 🚫 Error handling
    }
  }

  /**
   * 📜 Get a location by ID
   * @param id - The ID of the location to retrieve.
   * @returns The location record.
   * @throws NotFoundException if the location is not found.
   */
  async getLocationById(id: string): Promise<Location> {
    const location = await this.prisma.location.findUnique({ where: { id } });
    if (!location) {
      throw new NotFoundException('Location not found'); // 🚫 Error handling for not found
    }
    return location;
  }


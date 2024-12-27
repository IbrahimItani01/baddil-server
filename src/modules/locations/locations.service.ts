import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'; // 📦 Importing necessary exceptions
import { Location } from '@prisma/client'; // 📍 Importing Location type from Prisma
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access
import { CreateLocationDto } from './dto/locations.dto'; // 📄 Importing DTO

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {} // 🏗️ Injecting PrismaService

  /**
   * ➕ Create a new location
   * @param createLocationDto - The location details including name, longitude, and latitude.
   * @returns The created location record.
   * @throws InternalServerErrorException if there is an error creating the location.
   */
  async createLocation(
    createLocationDto: CreateLocationDto,
  ): Promise<Location> {
    try {
      return await this.prisma.location.create({
        data: createLocationDto, // Using DTO for creating location
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

  /**
   * 📜 Get all locations
   * @returns An array of all locations.
   */
  async getAllLocations(): Promise<Location[]> {
    return this.prisma.location.findMany(); // 🔍 Fetching all locations
  }
}

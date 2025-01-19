import { Injectable } from '@nestjs/common'; // 📦 Importing necessary exceptions
import { Location } from '@prisma/client'; // 📍 Importing Location type from Prisma
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access
import { CreateLocationDto } from './dto/locations.dto'; // 📄 Importing DTO
import { handleError } from 'src/utils/general/error.utils';
import { checkEntityExists } from 'src/utils/general/models.utils';

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
      handleError(error, 'failed to create location');
    }
  }

  /**
   * 📜 Get a location by ID
   * @param id - The ID of the location to retrieve.
   * @returns The location record.
   * @throws NotFoundException if the location is not found.
   */
  async getLocationById(id: string): Promise<Location> {
    try {
      const location = await checkEntityExists(this.prisma, 'location', id);
      return location;
    } catch (error) {
      handleError(error, 'failed getting location');
    }
  }

  /**
   * 📜 Get all locations
   * @returns An array of all locations.
   */
  async getAllLocations(): Promise<Location[]> {
    try {
      return this.prisma.location.findMany(); // 🔍 Fetching all locations
    } catch (error) {
      handleError(error, 'failed getting locations');
    }
  }
}

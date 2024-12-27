import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { LocationsService } from './locations.service'; // 📍 Importing LocationsService for business logic
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard

@Controller('locations') // 📍 Base route for location-related operations
@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
@AllowedUserTypes('barterer', 'broker') // 🎯 Restricting access to barterers and brokers
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {} // 🏗️ Injecting LocationsService

  /**
   * ➕ Create a new location
   * @param name - The name of the location.
   * @param longitude - The longitude of the location.
   * @param latitude - The latitude of the location.
   * @returns The created location record.
   */
  @Post('create') // ➕ Endpoint to create a location
  async createLocation(
    @Body('name') name: string,
    @Body('longitude') longitude: number,
    @Body('latitude') latitude: number,
  ) {
    try {
      const location = await this.locationsService.createLocation(
        name,
        longitude,
        latitude,
      );
      return {
        status: 'success',
        message: 'Location created successfully',
        data: location,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to create location: ' + error.message,
        HttpStatus.BAD_REQUEST, // 400 Bad Request
      );
    }
  }

  /**
   * 📜 Get a location by ID
   * @param id - The ID of the location to retrieve.
   * @returns The location record.
   */
  @Get(':id') // 📥 Endpoint to get a specific location
  async getLocationById(@Param('id') id: string) {
    try {
      const location = await this.locationsService.getLocationById(id);
      if (!location) {
        throw new HttpException('Location not found', HttpStatus.NOT_FOUND); // 404 Not Found
      }
      return {
        status: 'success',
        message: 'Location retrieved successfully',
        data: location,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve location: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500 Internal Server Error
      );
    }
  }


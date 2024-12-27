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
import { CreateLocationDto } from './dto/locations.dto'; // 📄 Importing DTOs
import { ApiResponse } from 'src/utils/api/apiResponse.interface';

@Controller('locations') // 📍 Base route for location-related operations
@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
@AllowedUserTypes('barterer', 'broker') // 🎯 Restricting access to barterers and brokers
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {} // 🏗️ Injecting LocationsService

  /**
   * ➕ Create a new location
   * @param createLocationDto - The location details including name, longitude, and latitude.
   * @returns The created location record.
   */
  @Post('create') // ➕ Endpoint to create a location
  async createLocation(
    @Body() createLocationDto: CreateLocationDto,
  ): Promise<ApiResponse> {
    const location =
      await this.locationsService.createLocation(createLocationDto);
    return {
      success: true,
      message: 'Location created successfully',
      data: location,
    };
  }

  /**
   * 📜 Get a location by ID
   * @param id - The ID of the location to retrieve.
   * @returns The location record.
   */
  @Get(':id') // 📥 Endpoint to get a specific location
  async getLocationById(@Param('id') id: string): Promise<ApiResponse> {
    const location = await this.locationsService.getLocationById(id);
    if (!location) {
      throw new HttpException('Location not found', HttpStatus.NOT_FOUND); // 404 Not Found
    }
    return {
      success: true,
      message: 'Location retrieved successfully',
      data: location,
    };
  }

  /**
   * 📜 Get all locations
   * @returns An array of all locations.
   */
  @Get() // 📥 Endpoint to get all locations
  async getAllLocations(): Promise<ApiResponse> {
    const locations = await this.locationsService.getAllLocations();
    return {
      success: true,
      message: 'Locations retrieved successfully',
      data: locations,
    };
  }
}

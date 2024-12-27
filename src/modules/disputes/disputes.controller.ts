import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { DisputesService } from './disputes.service'; // ⚖️ Importing DisputesService for business logic
import { DisputeStatus } from '@prisma/client'; // 📜 Importing DisputeStatus enum from Prisma
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards
import {
  CreateDisputeDto,
  DisputeDto,
  ResolveDisputeDto,
} from './dto/disputes.dto'; // 📥 Importing DTOs

@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
@Controller('disputes') // 📍 Base route for dispute-related operations
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {} // 🏗️ Injecting DisputesService

  /**
   * ➕ Create a new dispute
   * @param body - The dispute details including admin ID, user IDs, and details.
   * @returns The created dispute record.
   */
  @AllowedUserTypes('broker', 'barterer') // 🎯 Restricting access to brokers and barterers
  @Post() // ➕ Endpoint to create a dispute
  async createDispute(
    @Body() body: CreateDisputeDto, // 📥 Using CreateDisputeDto for request body validation
  ): Promise<{ status: string; message: string; data: DisputeDto }> {
    try {
      const dispute = await this.disputesService.createDispute(body); // 🔄 Creating a dispute
      return {
        status: 'success',
        message: 'Dispute created successfully',
        data: dispute, // 🎉 Returning the dispute data
      };
    } catch (error) {
      throw new HttpException(
        'Failed to create dispute: ' + error.message,
        HttpStatus.BAD_REQUEST, // 400 Bad Request
      );
    }
  }

  /**
   * 📜 Get all disputes
   * @param query - Optional filters for status and user ID.
   * @returns An array of disputes matching the filters.
   */
  @AllowedUserTypes('admin') // 🎯 Restricting access to admin users
  @Get() // 📥 Endpoint to get disputes
  async getDisputes(
    @Query() query: { status?: DisputeStatus; userId?: string }, // 📥 Optional filters for status and user ID
  ): Promise<{ status: string; message: string; data: DisputeDto[] }> {
    try {
      const disputes = await this.disputesService.getDisputes(query); // 🔍 Fetching disputes
      return {
        status: 'success',
        message: 'Disputes retrieved successfully',
        data: disputes, // 🎉 Returning disputes data
      };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve disputes: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500 Internal Server Error
      );
    }
  }

  /**
   * 📜 Get a specific dispute by ID
   * @param id - The ID of the dispute to retrieve.
   * @returns The dispute record.
   */
  @AllowedUserTypes('admin') // 🎯 Restricting access to admin users
  @Get(':id') // 📥 Endpoint to get a specific dispute
  async getDispute(
    @Param('id') id: string,
  ): Promise<{ status: string; message: string; data: DisputeDto }> {
    try {
      const dispute = await this.disputesService.getDispute(id); // 🔍 Fetching a specific dispute
      return {
        status: 'success',
        message: 'Dispute retrieved successfully',
        data: dispute, // 🎉 Returning dispute data
      };
    } catch (error) {
      throw new HttpException(
        'Dispute not found: ' + error.message,
        HttpStatus.NOT_FOUND, // 404 Not Found
      );
    }
  }

  /**
   * ✏️ Resolve a dispute
   * @param id - The ID of the dispute to resolve.
   * @returns The updated dispute record.
   */
  @AllowedUserTypes('admin') // 🎯 Restricting access to admin users
  @Patch(':id/resolve') // ✏️ Endpoint to resolve a dispute
  async resolveDispute(
    @Param('id') id: string, // 📥 Dispute ID from URL params
    @Body() body: ResolveDisputeDto, // 📥 Using ResolveDisputeDto for request body validation
  ): Promise<{ status: string; message: string; data: DisputeDto }> {
    try {
      const updatedDispute = await this.disputesService.resolveDispute(
        id,
        body,
      ); // 🔄 Resolving the dispute
      return {
        status: 'success',
        message: 'Dispute resolved successfully',
        data: updatedDispute, // 🎉 Returning the updated dispute data
      };
    } catch (error) {
      throw new HttpException(
        'Failed to resolve dispute: ' + error.message,
        HttpStatus.BAD_REQUEST, // 400 Bad Request
      );
    }
  }
}

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards
import { BartersService } from './barters.service'; // 🤝 Importing BartersService for business logic
import {
  CreateBarterDto,
  UpdateBarterStatusDto,
  BarterResponseDto,
} from './dto/barters.dto'; // 📜 Importing DTOs

@Controller('barters') // 📍 Base route for barter-related operations
@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
@AllowedUserTypes('barterer', 'broker') // 🎯 Restricting access to specific user types
export class BartersController {
  constructor(private readonly barterService: BartersService) {} // 🏗️ Injecting BartersService

  /**
   * 📜 Get Barters by User
   * Fetches all barters for the logged-in user.
   */
  @Get('/by-user') // 📥 Endpoint to get barters by user
  async getUserBarters(
    @Request() req: any,
  ): Promise<{ status: string; message: string; data: BarterResponseDto[] }> {
    try {
      const userId = req.user.id; // 🧑‍💻 Extracting the user ID from the JWT
      const barters = await this.barterService.getBartersByUser(userId); // 🔍 Fetching barters for the user

      // 🗂️ Map the response to BarterResponseDto
      const response: BarterResponseDto[] = barters.map((barter) => ({
        id: barter.id, // 🆔 Barter ID
        user1_id: barter.user1_id, // 🧑‍💼 First user's ID
        user2_id: barter.user2_id, // 🧑‍💼 Second user's ID
        user1_item_id: barter.user1_item_id, // 📦 Item ID of the first user
        user2_item_id: barter.user2_item_id, // 📦 Item ID of the second user
        status: barter.status, // 📝 Current status of the barter
      }));

      return {
        status: 'success', // ✅ Success status
        message: 'Barters fetched successfully', // ✅ Success message
        data: response, // 🎉 Barters data
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error', // 🚫 Error status
          message: 'Failed to fetch barters', // 🚫 Error message
          error: error.message, // 🔍 Detailed error message
        },
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  /**
   * ➕ Create Barter
   * Creates a new barter between two users.
   */
  @Post('') // ➕ Endpoint to create a barter
  async createBarter(
    @Body() barterDetails: CreateBarterDto, // 📜 Apply DTO for validation
    @Request() req, // 🧑‍💻 Request object to access user info
  ): Promise<{ status: string; message: string; data: BarterResponseDto }> {
    try {
      const createdBarter = await this.barterService.createBarter(
        req.user.id, // 🏷️ User ID from the request
        barterDetails, // 📜 Barter details
      );

      const response: BarterResponseDto = {
        id: createdBarter.id, // 🆔 Barter ID
        user1_id: createdBarter.user1_id, // 🧑‍💼 First user's ID
        user2_id: createdBarter.user2_id, // 🧑‍💼 Second user's ID
        user1_item_id: createdBarter.user1_item_id, // 📦 Item ID of the first user
        user2_item_id: createdBarter.user2_item_id, // 📦 Item ID of the second user
        status: createdBarter.status, // 📝 Current status of the barter
      };

      return {
        status: 'success', // ✅ Success status
        message: 'Barter created successfully', // ✅ Success message
        data: response, // 🎉 Created barter data
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error', // 🚫 Error status
          message: 'Failed to create barter', // 🚫 Error message
          error: error.message, // 🔍 Detailed error message
        },
        HttpStatus.BAD_REQUEST, // ⚠️ Client error status
      );
    }
  }

  /**
   * ✏️ Update Barter Status
   * Updates the status of an existing barter.
   */
  @Put('') // ✏️ Endpoint to update barter status
  async updateBarterStatus(
    @Body() updateDetails: UpdateBarterStatusDto, // 📜 Apply DTO for validation
  ) {
    try {
      const updatedBarter = await this.barterService.updateBarterStatus(
        updateDetails, // 📜 Update details
      );
      return {
        status: 'success', // ✅ Success status
        message: 'Barter status updated successfully', // ✅ Success message
        data: updatedBarter, // 🎉 Updated barter data
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error', // 🚫 Error status
          message: 'Failed to update barter status', // 🚫 Error message
          error: error.message, // 🔍 Detailed error message
        },
        HttpStatus.BAD_REQUEST, // ⚠️ Client error status
      );
    }
  }

  /**
   * ❌ Cancel Barter
   * Cancels an existing barter.
   */
  @Delete('') // ❌ Endpoint to cancel a barter
  async cancelBarter(@Body() barterId: { barterId: string }) {
    try {
      await this.barterService.cancelBarter(barterId.barterId); // 🗑️ Cancelling the barter
      return {
        status: 'success', // ✅ Success status
        message: 'Barter canceled successfully', // ✅ Success message
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error', // 🚫 Error status
          message: 'Failed to cancel barter', // 🚫 Error message
          error: error.message, // 🔍 Detailed error message
        },
        HttpStatus.BAD_REQUEST, // ⚠️ Client error status
      );
    }
  }
}

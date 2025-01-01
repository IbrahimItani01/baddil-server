import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards
import { BartersService } from './barters.service'; // 🤝 Importing BartersService for business logic
import {
  CreateBarterDto,
  UpdateBarterStatusDto,
  BarterResponseDto,
} from './dto/barters.dto'; // 📜 Importing DTOs
import { ApiResponse } from 'src/utils/api/apiResponse.interface';

@Controller('barters') // 📍 Base route for barter-related operations
@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
export class BartersController {
  constructor(private readonly barterService: BartersService) {} // 🏗️ Injecting BartersService

  /**
   * 📜 Get Barters by User
   * Fetches all barters for the logged-in user.
   */
  @AllowedUserTypes('barterer', 'broker') // 🎯 Restricting access to specific user types
  @Get('/by-user') // 📥 Endpoint to get barters by user
  async getUserBarters(@Request() req: any): Promise<ApiResponse> {
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
      success: true,
      message: 'Barters fetched successfully', // ✅ Success message
      data: response, // 🎉 Barters data
    };
  }

  /**
   * ➕ Create Barter
   * Creates a new barter between two users.
   */
  @AllowedUserTypes('barterer', 'broker') // 🎯 Restricting access to specific user types
  @Post('') // ➕ Endpoint to create a barter
  async createBarter(
    @Body() barterDetails: CreateBarterDto, // 📜 Apply DTO for validation
    @Request() req, // 🧑‍💻 Request object to access user info
  ): Promise<ApiResponse> {
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
      success: true,
      message: 'Barter created successfully', // ✅ Success message
      data: response, // 🎉 Created barter data
    };
  }

  /**
   * ✏️ Update Barter Status
   * Updates the status of an existing barter.
   */
  @AllowedUserTypes('barterer', 'broker') // 🎯 Restricting access to specific user types
  @Put('')
  async updateBarterStatus(
    @Body() updateDetails: UpdateBarterStatusDto, // 📜 Apply DTO for validation
  ): Promise<ApiResponse> {
    const updatedBarter = await this.barterService.updateBarterStatus(
      updateDetails, // 📜 Update details
    );
    return {
      success: true,
      message: 'Barter status updated successfully', // ✅ Success message
      data: updatedBarter, // 🎉 Updated barter data
    };
  }

  /**
   * ❌ Cancel Barter
   * Cancels an existing barter.
   */
  @AllowedUserTypes('barterer', 'broker') // 🎯 Restricting access to specific user types
  @Delete('')
  async cancelBarter(
    @Body() barterId: { barterId: string },
  ): Promise<ApiResponse> {
    await this.barterService.cancelBarter(barterId.barterId); // 🗑️ Cancelling the barter
    return {
      success: true, // ✅ Success
      message: 'Barter canceled successfully', // ✅ Success message
    };
  }
}

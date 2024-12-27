import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Put,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { AIService } from './ai.service'; // 🤖 Importing AIService for business logic
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards
import { ToggleAutoTradeDto, UpdateAutoTradeDto } from './dto/ai.dto'; // 📦 Importing DTOs

/**
 * 🌐 AI Controller
 * This controller handles operations related to AI-managed barters,
 * such as toggling auto-trade, fetching auto-trades, and updating trade statuses.
 */
@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
@AllowedUserTypes('barterer', 'broker', 'admin') // 🎯 Restricting access to specific user types
@Controller('ai') // 📍 Base route for AI-related operations
export class AIController {
  constructor(private readonly aiService: AIService) {} // 🏗️ Injecting AIService

  /**
   * 📜 Get all auto-trades
   * Fetches all barters that are handled by AI.
   */
  @Get('barters') // 📥 Endpoint to get all auto-trades
  async getAutoTrades() {
    try {
      const trades = await this.aiService.getAutoTrades(); // 🔍 Fetching auto-trades
      return { success: true, data: trades }; // ✅ Successful data retrieval
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch auto-trades', // 🚫 Error message
          error: error.message, // 🔍 Detailed error message
        },
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Server error status
      );
    }
  }

  /**
   * 🔄 Toggle auto-trade
   * Enables or disables AI management for a specific barter.
   */
  @Patch('barters/toggle') // 🔄 Endpoint to toggle auto-trade
  async toggleAutoTrade(@Body() toggleAutoTradeDto: ToggleAutoTradeDto) {
    // 📝 Accept DTO as parameter
    try {
      // Pass the DTO directly to the service method
      const updatedBarter =
        await this.aiService.toggleAutoTrade(toggleAutoTradeDto); // 🔄 Toggling auto-trade

      return {
        success: true,
        message: 'Auto-trade updated successfully', // ✅ Success message
        data: updatedBarter, // 🎉 Updated barter data
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to toggle auto-trade', // 🚫 Error message
          error: error.message, // 🔍 Detailed error message
        },
        HttpStatus.BAD_REQUEST, // ⚠️ Client error status
      );
    }
  }

  /**
   * ✏️ Update auto-trade
   * Updates details or status for a specific AI-managed barter.
   */
  @Put('barters') // ✏️ Endpoint to update auto-trade
  async updateAutoTrade(@Body() updateAutoTradeDto: UpdateAutoTradeDto) {
    // 📝 Accept DTO as parameter
    try {
      // Pass the DTO directly to the service method
      const updatedBarter =
        await this.aiService.updateAutoTrade(updateAutoTradeDto); // 🔄 Updating auto-trade

      return {
        success: true,
        message: 'Auto-trade updated successfully', // ✅ Success message
        data: updatedBarter, // 🎉 Updated barter data
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to update auto-trade', // 🚫 Error message
          error: error.message, // 🔍 Detailed error message
        },
        HttpStatus.BAD_REQUEST, // ⚠️ Client error status
      );
    }
  }

  /**
   * 💬 Get auto-trade chat
   * Fetches chat details for a specific barter.
   */
  @Get('barters/:barterId/chat') // 📥 Endpoint to get chat details for a barter
  async getAutoTradeChat(@Param('barterId') barterId: string) {
    // 📝 Accepting barterId directly from the route parameter
    try {
      const chat = await this.aiService.getAutoTradeChat(barterId); // 🔍 Fetching chat details for the specified barter
      return { success: true, data: chat }; // ✅ Successful data retrieval
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch chat', // 🚫 Error message
          error: error.message, // 🔍 Detailed error message
        },
        HttpStatus.NOT_FOUND, // ⚠️ Not found status
      );
    }
  }
}

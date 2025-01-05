import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Put,
  UseGuards,
  Req,
  Post,
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { AIService } from './ai.service'; // 🤖 Importing AIService for business logic
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards
import { ToggleAutoTradeDto, UpdateAutoTradeDto } from './dto/ai.dto'; // 📦 Importing DTOs
import { ApiResponse } from 'src/utils/api/apiResponse.interface';

/**
 * 🌐 AI Controller
 * This controller handles operations related to AI-managed barters,
 * such as toggling auto-trade, fetching auto-trades, and updating trade statuses.
 */
@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
@Controller('ai') // 📍 Base route for AI-related operations
export class AIController {
  constructor(private readonly aiService: AIService) {} // 🏗️ Injecting AIService

  /**
   * 📜 Get all auto-trades
   * Fetches all barters that are handled by AI.
   */
  @AllowedUserTypes('barterer', 'broker', 'admin') // 🎯 Restricting access to specific user types
  @Get('barters')
  async getAutoTrades(): Promise<ApiResponse> {
    const trades = await this.aiService.getAutoTrades(); // 🔍 Fetching auto-trades
    return {
      success: true,
      message: 'Auto trades retrieved successfully',
      data: trades,
    }; // ✅ Successful data retrieval
  }

  /**
   * 🔄 Toggle auto-trade
   * Enables or disables AI management for a specific barter.
   */
  @AllowedUserTypes('barterer', 'broker', 'admin') // 🎯 Restricting access to specific user types
  @Patch('barters/toggle') // 🔄 Endpoint to toggle auto-trade
  async toggleAutoTrade(
    @Body() toggleAutoTradeDto: ToggleAutoTradeDto,
    @Req() req: any,
  ): Promise<ApiResponse> {
    // 📝 Accept DTO as parameter
    // Pass the DTO directly to the service method
    const updatedBarter = await this.aiService.toggleAutoTrade(
      toggleAutoTradeDto,
      req.user.id,
    ); // 🔄 Toggling auto-trade

    return {
      success: true,
      message: 'Auto-trade updated successfully', // ✅ Success message
      data: updatedBarter, // 🎉 Updated barter data
    };
  }

  /**
   * ✏️ Update auto-trade
   * Updates details or status for a specific AI-managed barter.
   */
  @AllowedUserTypes('barterer', 'broker', 'admin') // 🎯 Restricting access to specific user types
  @Put('barters') // ✏️ Endpoint to update auto-trade
  async updateAutoTrade(
    @Body() updateAutoTradeDto: UpdateAutoTradeDto,
  ): Promise<ApiResponse> {
    // 📝 Accept DTO as parameter
    // Pass the DTO directly to the service method
    const updatedBarter =
      await this.aiService.updateAutoTrade(updateAutoTradeDto); // 🔄 Updating auto-trade

    return {
      success: true,
      message: 'Auto-trade updated successfully', // ✅ Success message
      data: updatedBarter, // 🎉 Updated barter data
    };
  }

  /**
   * 💬 Get auto-trade chat
   * Fetches chat details for a specific barter.
   */
  @AllowedUserTypes('barterer', 'broker', 'admin') // 🎯 Restricting access to specific user types
  @Get('barters/:barterId/chat') // 📥 Endpoint to get chat details for a barter
  async getAutoTradeChat(
    @Param('barterId') barterId: string,
  ): Promise<ApiResponse> {
    // 📝 Accepting barterId directly from the route parameter
    const chat = await this.aiService.getAutoTradeChat(barterId); // 🔍 Fetching chat details for the specified barter
    return {
      success: true,
      message: 'Retrieved auto trade chat successfully',
      data: chat,
    }; // ✅ Successful data retrieval
  }

  /**
   * 💬 Get recommended categories
   * Fetches top 3 recommended categories
   */
  @AllowedUserTypes('barterer') // 🎯 Restricting access to specific user types
  @Get('recommend-categories')
  async recommendCategories(@Req() req: any): Promise<ApiResponse> {
    const userId = req.user.id; // Extract user ID from the request
    const recommendations = await this.aiService.recommendCategories(userId);

    return {
      success: true,
      message: 'Recommended categories and subcategories fetched successfully',
      data: recommendations,
    };
  }

  /**
   * 💬 Respond on behalf of user
   *  Allows ai to respond on behalf of another user
   */
  @AllowedUserTypes('barterer') // 🎯 Restricting access to barterers and brokers only
  @Post('respond/:barterId') // 📥 Endpoint to get AI response for a specific barter chat
  async chatOnBehalf(
    @Param('barterId') barterId: string, // 📍 Getting the barter ID from route params
    @Body() body: any, // 🛠️ Accessing body to get the user ID
  ): Promise<ApiResponse> {
    const aiResponse = await this.aiService.chatOnBehalf(barterId, body.userId); // 🤖 Getting AI response from service
    return {
      success: true,
      message: 'AI response generated successfully',
      data: aiResponse, // 🎉 Return the AI response
    };
  }

  /**
   * 💬 Generate value for the added item
   *  Based on item data and images ai generates a value for the item
   */
  @AllowedUserTypes('barterer')
  @Post('generate-price')
  async generatePrice(@Body() body: any): Promise<ApiResponse> {
    const { itemId } = body;
    const price = await this.aiService.generatePrice(itemId as string);
    return {
      success: true,
      message: 'Price generated successfully',
      data: price,
    };
  }

  /**
   * 🌐 AI Controller (Partial for Barter Recommendations)
   */
  @AllowedUserTypes('barterer')
  @Get('items/:itemId/recommend')
  async recommendBarterItems(
    @Param('itemId') itemId: string,
    @Req() req: any,
  ): Promise<ApiResponse> {
    const userId = req.user.id;
    const recommendations = await this.aiService.getBarterRecommendations(
      userId,
      itemId,
    );
    return {
      success: true,
      message: 'Recommended items fetched successfully',
      data: recommendations,
    };
  }

  /**
   * 🔢 Get Success Probability
   * Calculates the probability of a successful barter based on previous barter statuses.
   */
  @AllowedUserTypes('barterer', 'broker', 'admin') // Restricting access to specific user types
  @Get('success-probability/:email') // Endpoint for getting success probability based on email
  async getSuccessProbability(
    @Param('email') email: string, // Accepting the email parameter from the route
  ): Promise<ApiResponse> {
    // Fetching success probability by passing email
    const probability = await this.aiService.getSuccessProbability(email);
    return {
      success: true,
      message: 'Success probability calculated successfully',
      data: probability, // Returning the calculated probability
    };
  }
}

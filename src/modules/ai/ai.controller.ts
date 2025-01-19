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
 * Handles AI-powered barter features like auto-trade toggling, recommendations,
 * and credibility analysis.
 */
@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
@Controller('ai') // 📍 Base route for AI-related operations
export class AIController {
  constructor(private readonly aiService: AIService) {} // 🏗️ Injecting AIService

  /**
   * 📜 Get all auto-trades
   * Fetches all AI-managed barters.
   */
  @AllowedUserTypes('barterer', 'broker', 'admin') // 🎯 Restricting access to specific user types
  @Get('barters')
  async getAutoTrades(): Promise<ApiResponse> {
    const trades = await this.aiService.getAutoTrades(); // 🔍 Fetching auto-trades
    return {
      success: true,
      message: 'Auto trades retrieved successfully',
      data: trades,
    }; // ✅ Returning data
  }

  /**
   * 🔄 Toggle auto-trade
   * Enables or disables AI management for a barter.
   */
  @AllowedUserTypes('barterer', 'broker', 'admin') // 🎯 Restricting access to specific user types
  @Patch('barters/toggle')
  async toggleAutoTrade(
    @Body() toggleAutoTradeDto: ToggleAutoTradeDto,
    @Req() req: any,
  ): Promise<ApiResponse> {
    const updatedBarter = await this.aiService.toggleAutoTrade(
      toggleAutoTradeDto,
      req.user.id,
    ); // 🔄 Toggling auto-trade
    return {
      success: true,
      message: 'Auto-trade updated successfully',
      data: updatedBarter,
    }; // ✅ Returning updated barter
  }

  /**
   * ✏️ Update auto-trade
   * Updates details or status for an AI-managed barter.
   */
  @AllowedUserTypes('barterer', 'broker', 'admin') // 🎯 Restricting access to specific user types
  @Put('barters')
  async updateAutoTrade(
    @Body() updateAutoTradeDto: UpdateAutoTradeDto,
  ): Promise<ApiResponse> {
    const updatedBarter =
      await this.aiService.updateAutoTrade(updateAutoTradeDto); // 🔄 Updating barter details
    return {
      success: true,
      message: 'Auto-trade updated successfully',
      data: updatedBarter,
    }; // ✅ Returning updated data
  }

  /**
   * 💬 Get auto-trade chat
   * Retrieves chat details for a barter.
   */
  @AllowedUserTypes('barterer', 'broker', 'admin') // 🎯 Restricting access to specific user types
  @Get('barters/:barterId/chat')
  async getAutoTradeChat(
    @Param('barterId') barterId: string,
  ): Promise<ApiResponse> {
    const chat = await this.aiService.getAutoTradeChat(barterId); // 🔍 Fetching chat details
    return {
      success: true,
      message: 'Retrieved auto trade chat successfully',
      data: chat,
    }; // ✅ Returning chat data
  }

  /**
   * 📊 Recommend categories
   * Fetches top 3 recommended categories and subcategories.
   */
  @AllowedUserTypes('barterer') // 🎯 Restricting access to barterers
  @Get('recommend-categories')
  async recommendCategories(@Req() req: any): Promise<ApiResponse> {
    const userId = req.user.id; // 🔑 Extracting user ID
    const recommendations = await this.aiService.recommendCategories(userId); // 🔍 Fetching recommendations
    return {
      success: true,
      message: 'Recommended categories and subcategories fetched successfully',
      data: recommendations,
    }; // ✅ Returning recommendations
  }

  /**
   * 🗨️ Chat on behalf
   * Allows AI to respond on behalf of a user.
   */
  @AllowedUserTypes('barterer') // 🎯 Restricting access to barterers
  @Post('respond/:barterId')
  async chatOnBehalf(
    @Param('barterId') barterId: string,
    @Body() body: any,
  ): Promise<ApiResponse> {
    const aiResponse = await this.aiService.chatOnBehalf(barterId, body.userId); // 🤖 Generating AI response
    return {
      success: true,
      message: 'AI response generated successfully',
      data: aiResponse,
    }; // ✅ Returning AI response
  }

  /**
   * 💰 Generate item price
   * Computes item value using AI based on item details.
   */
  @AllowedUserTypes('barterer') // 🎯 Restricting access to barterers
  @Post('generate-price')
  async generatePrice(@Body() body: any): Promise<ApiResponse> {
    const { itemId } = body;
    const price = await this.aiService.generatePrice(itemId as string); // 💵 Generating price
    return {
      success: true,
      message: 'Price generated successfully',
      data: price,
    }; // ✅ Returning item price
  }

  /**
   * 🔎 Recommend barter items
   * Suggests items for a barter based on AI analysis.
   */
  @AllowedUserTypes('barterer') // 🎯 Restricting access to barterers
  @Get('items/:itemId/recommend')
  async recommendBarterItems(
    @Param('itemId') itemId: string,
    @Req() req: any,
  ): Promise<ApiResponse> {
    const userId = req.user.id; // 🔑 Extracting user ID
    const recommendations = await this.aiService.getBarterRecommendations(
      userId,
      itemId,
    ); // 🔍 Fetching recommendations
    return {
      success: true,
      message: 'Recommended items fetched successfully',
      data: recommendations,
    }; // ✅ Returning recommended items
  }

  /**
   * 📈 Get success probability
   * Calculates the probability of a successful barter.
   */
  @AllowedUserTypes('barterer', 'broker', 'admin') // 🎯 Restricting access to specific user types
  @Get('success-probability/:email')
  async getSuccessProbability(
    @Param('email') email: string,
  ): Promise<ApiResponse> {
    const probability = await this.aiService.getSuccessProbability(email); // 📊 Calculating probability
    return {
      success: true,
      message: 'Success probability calculated successfully',
      data: probability,
    }; // ✅ Returning success probability
  }

  /**
   * 🏅 Get user credibility
   * Checks user credibility based on past barter ratings.
   */
  @AllowedUserTypes('barterer', 'broker', 'admin') // 🎯 Restricting access to specific user types
  @Get('credibility/:email')
  async getCredibility(@Param('email') email: string): Promise<ApiResponse> {
    const isCredible = await this.aiService.getCredibility(email); // 🏆 Fetching credibility status
    return {
      success: true,
      message: 'User credibility determined successfully',
      data: isCredible,
    }; // ✅ Returning credibility status
  }
}

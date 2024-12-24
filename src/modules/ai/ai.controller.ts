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
} from '@nestjs/common';
import { AIService } from './ai.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard';

/**
 * 🌐 AI Controller
 * This controller handles operations related to AI-managed barters,
 * such as toggling auto-trade, fetching auto-trades, and updating trade statuses.
 */
@UseGuards(JwtAuthGuard, UserTypeGuard)
@AllowedUserTypes('barterer', 'broker', 'admin')
@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  /**
   * 📜 Get all auto-trades
   * Fetches all barters that are handled by AI.
   */
  @Get('barters')
  async getAutoTrades() {
    try {
      const trades = await this.aiService.getAutoTrades();
      return { success: true, data: trades };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch auto-trades',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 🔄 Toggle auto-trade
   * Enables or disables AI management for a specific barter.
   */
  @Patch('barters/toggle')
  async toggleAutoTrade(@Body() body: { barterId: string; enabled: boolean }) {
    const { barterId, enabled } = body;
    try {
      const updatedBarter = await this.aiService.toggleAutoTrade(
        barterId,
        enabled,
      );
      return {
        success: true,
        message: 'Auto-trade updated successfully',
        data: updatedBarter,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to toggle auto-trade',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * ✏️ Update auto-trade
   * Updates details or status for a specific AI-managed barter.
   */
  @Put('barters')
  async updateAutoTrade(
    @Body() updateDetails: { barterId: string; status?: string; details?: any },
  ) {
    const { barterId, ...rest } = updateDetails;
    try {
      const updatedBarter = await this.aiService.updateAutoTrade(
        barterId,
        rest,
      );
      return {
        success: true,
        message: 'Auto-trade updated successfully',
        data: updatedBarter,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to update auto-trade',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 💬 Get auto-trade chat
   * Fetches chat details for a specific barter.
   */
  @Get('barters/:barterId/chat')
  async getAutoTradeChat(@Param('barterId') barterId: string) {
    try {
      const chat = await this.aiService.getAutoTradeChat(barterId);
      return { success: true, data: chat };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch chat',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}

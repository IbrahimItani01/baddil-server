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

@UseGuards(JwtAuthGuard, UserTypeGuard)
@AllowedUserTypes('barterer', 'broker', 'admin')
@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

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
  async updateAutoTrade(
    @Param('barterId') barterId: string,
    @Body() updateDetails: { status?: string; details?: any },
  ) {
    return await this.aiService.updateAutoTrade(barterId, updateDetails);
  }

  @Get('barters/:barterId/chat')
  async getAutoTradeChat(@Param('barterId') barterId: string) {
    return await this.aiService.getAutoTradeChat(barterId);
  }
}

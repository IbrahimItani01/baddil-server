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
    return await this.aiService.getAutoTrades();
  }

  @Patch('barters/:barterId/toggle')
  async toggleAutoTrade(
    @Param('barterId') barterId: string,
    @Body() body: { enabled: boolean },
  ) {
    return await this.aiService.toggleAutoTrade(barterId, body.enabled);
  }

  @Put('barters/:barterId')
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

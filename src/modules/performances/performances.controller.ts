import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard';
import { PerformancesService } from './performances.service';
import {
  Controller,
  Get,
  UseGuards,
  HttpException,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@UseGuards(JwtAuthGuard, UserTypeGuard)
@AllowedUserTypes('broker')
@Controller('performance')
export class PerformancesController {
  constructor(private readonly performancesService: PerformancesService) {}

  @Get('earnings')
  async getBrokerEarnings(@Request() req: any) {
    const brokerId = req.user.id; // Extract broker ID from JWT
    try {
      const earnings =
        await this.performancesService.getBrokerEarnings(brokerId);
      return { success: true, data: earnings };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve earnings',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('barters')
  async getBrokerBarters(@Request() req: any) {
    const brokerId = req.user.id; // Extract broker ID from JWT
    try {
      const barters =
        await this.performancesService.getBrokerBartersGroupedByStatus(
          brokerId,
        );
      return { success: true, data: barters };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve barters',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


import { BadRequestException, Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard';

@UseGuards(JwtAuthGuard, UserTypeGuard)
@AllowedUserTypes('admin')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}
  

   @Get('user-count')
    async getUserCounts() {
      try {
        const counts = await this.statisticsService.getUserCounts();
        return {
          status: 'success',
          message: 'User counts retrieved successfully',
          data: counts,
        };
      } catch (error) {
        throw new BadRequestException(
          'Failed to retrieve user counts',
          error.message,
        );
      }
    }
}

import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BarterersService } from './barterers.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { UserTypeGuard, AllowedUserTypes } from 'src/guards/userType.guard';

@UseGuards(JwtAuthGuard, UserTypeGuard)
@AllowedUserTypes('barterer')
@Controller('barterers')
export class BarterersController {
  constructor(private readonly barterersService: BarterersService) {}

  @Get()
  async getBartererInfo(@Request() req) {
    try {
      const bartererInfo = await this.barterersService.getBartererInfo(
        req.user.id,
      );
      return { success: true, data: bartererInfo };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve barterer information',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

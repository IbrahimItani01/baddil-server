import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard';
import { BartersService } from './barters.service';
import { BarterStatus } from '@prisma/client';

@Controller('barters')
@UseGuards(JwtAuthGuard, UserTypeGuard)
@AllowedUserTypes('barterer')
export class BartersController {
  constructor(private readonly barterService: BartersService) {}

  @Get(':userId')
  async getBartersByUser(@Param('userId') userId: string) {
    try {
      const barters = await this.barterService.getBartersByUser(userId);
      return {
        status: 'success',
        message: 'Barters fetched successfully',
        data: barters,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Failed to fetch barters');
    }
  }

  @Post('')
  async createBarter(
    @Body()
    barterDetails: {
      user2Id: string;
      user1ItemId: string;
      user2ItemId: string;
    },
    @Request() req,
  ) {
    try {
      const createdBarter = await this.barterService.createBarter(
        req.user.id,
        barterDetails,
      );
      return {
        status: 'success',
        message: 'Barter created successfully',
        data: createdBarter,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Failed to create barter');
    }
  }

  @Put('')
  async updateBarterStatus(
    @Body() updateDetails: { barterId: string; status: BarterStatus },
  ) {
    try {
      const updatedBarter =
        await this.barterService.updateBarterStatus(updateDetails);
      return {
        status: 'success',
        message: 'Barter status updated successfully',
        data: updatedBarter,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Failed to update barter status');
    }
  }

  @Delete('')
  async cancelBarter(@Body() barterId: string) {
    try {
      await this.barterService.cancelBarter(barterId);
      return {
        status: 'success',
        message: 'Barter canceled successfully',
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Failed to cancel barter');
    }
  }
}

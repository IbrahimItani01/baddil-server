import {
  Controller,
  Get,
  UseGuards,
  Req,
  Put,
  Body,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    const userId = req.user.id;
    return this.usersService.findUserById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateMe(@Req() req: any, @Body() updateData: any) {
    const userId = req.user.id;
    return this.usersService.updateUser(userId, updateData);
  }
  
  @UseGuards(JwtAuthGuard)
  @Put('me/status')
  async changeStatus(@Req() req: any, @Body() body: { status: string }) {
    const userId = req.user.id;
    const { status } = body;

    if (!status) {
      throw new BadRequestException('Status is required');
    }

    try {
      const updatedUser = await this.usersService.changeUserStatus(userId, status);

      return {
        status: 'success',
        message: 'User status updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  // settings-related
  @UseGuards(JwtAuthGuard)
  @Patch('me/settings')
  async updateSettings(@Req() req: any, @Body() settingsData: any) {
    const userId = req.user.id;

    if (!settingsData || Object.keys(settingsData).length === 0) {
      throw new BadRequestException('No settings data provided');
    }

    try {
      const updateResult = await this.usersService.updateSettings(
        userId,
        settingsData,
      );

      return {
        status: 'success',
        message: 'Settings updated successfully',
        data: updateResult.data,
      };
    } catch (error) {
      throw new BadRequestException('Failed to update settings', error.message);
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('me/settings')
  async getUserSettings(@Req() req: any) {
    const userId = req.user.id;

    try {
      const settings = await this.usersService.getUserSettings(userId);

      return {
        status: 'success',
        message: 'User settings retrieved successfully',
        data: settings,
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to retrieve user settings',
        error.message,
      );
    }
  }
  // device-token related
}

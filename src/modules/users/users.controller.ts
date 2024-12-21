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
}

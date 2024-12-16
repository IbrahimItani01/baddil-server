import {
  Controller,
  Get,
  UseGuards,
  Req,
  Put,
  Body,
  Patch,
  BadRequestException,
  NotFoundException,
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

    const updateData = Object.keys(settingsData).reduce((acc, key) => {
      acc[`settings.${key}`] = settingsData[key];
      return acc;
    }, {});

    try {
      const updatedUser = await this.usersService.updateUser(
        userId,
        updateData,
      );

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      return {
        status: 'success',
        message: 'Settings updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw new BadRequestException('Failed to update settings', error.message);
    }
  }
}

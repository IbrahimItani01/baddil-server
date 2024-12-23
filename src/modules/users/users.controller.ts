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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions } from 'src/utils/modules/config/file-upload.config';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: any) {
    const userId = req.user.id;
    return this.usersService.findUserById(userId);
  }

  @Put('me')
  async updateMe(@Req() req: any, @Body() updateData: any) {
    const userId = req.user.id;
    return this.usersService.updateUser(userId, updateData);
  }

  @Put('me/status')
  async changeStatus(@Req() req: any, @Body() body: { status: string }) {
    const userId = req.user.id;
    const { status } = body;

    if (!status) {
      throw new BadRequestException('Status is required');
    }

    try {
      const updatedUser = await this.usersService.changeUserStatus(
        userId,
        status,
      );

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

  @Put('me/device-token')
  async saveDeviceToken(
    @Req() req: any,
    @Body() body: { deviceToken: string },
  ) {
    const userId = req.user.id;
    const { deviceToken } = body;

    if (!deviceToken) {
      throw new BadRequestException('Device token is required');
    }

    try {
      const updatedUser = await this.usersService.updateDeviceToken(
        userId,
        deviceToken,
      );

      return {
        status: 'success',
        message: 'Device token updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to update device token',
        error.message,
      );
    }
  }

  @Get('me/device-token')
  async getDeviceToken(@Req() req: any) {
    const userId = req.user.id;

    try {
      const deviceToken = await this.usersService.getDeviceToken(userId);

      if (!deviceToken) {
        throw new BadRequestException('Device token not found');
      }

      return {
        status: 'success',
        message: 'Device token retrieved successfully',
        data: { deviceToken },
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to retrieve device token',
        error.message,
      );
    }
  }

  @Get('me/profile-picture')
  async getProfilePicture(@Req() req: any) {
    const userId = req.user.id; // Extract the user ID from the JWT payload

    try {
      const profilePicture = await this.usersService.getProfilePicture(userId);

      if (!profilePicture) {
        throw new NotFoundException('Profile picture not found');
      }

      return {
        status: 'success',
        message: 'Profile picture retrieved successfully',
        data: { profilePicture },
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to retrieve profile picture',
        error.message,
      );
    }
  }

  @Put('me/profile-picture')
  @UseInterceptors(FileInterceptor('file', fileUploadOptions))
  async uploadProfilePicture(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Construct the file URL for the uploaded image
    const fileUrl = `/uploads/profile-pictures/${file.filename}`;

    // Save the file URL to the user's record in the database
    const updatedUser = await this.usersService.updateProfilePicture(
      req.user.id,
      fileUrl,
    );

    return {
      status: 'success',
      message: 'Profile picture uploaded successfully',
      data: updatedUser,
    };
  }
}

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
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../guards/jwt.guard'; // 🔐 Importing the JWT guard
import { FileInterceptor } from '@nestjs/platform-express'; // 📂 File upload interceptor
import { fileUploadOptions } from 'src/utils/modules/config/file-upload.config'; // ⚙️ File upload config
import {
  UpdateUserDto,
  ChangeStatusDto,
  UpdateSettingsDto,
  DeviceTokenDto,
} from './dto/users.dto'; // 📋 Importing DTOs

@UseGuards(JwtAuthGuard) // 🔐 Applying the JWT guard to all routes in this controller
@Controller('users') // 📂 Base route for user-related operations
export class UsersController {
  constructor(private readonly usersService: UsersService) {} // 💉 Injecting the UsersService

  /**
   * 🛠️ Get current user details
   * @returns Current user's details
   */
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: any) {
    const userId = req.user.id;
    try {
      return await this.usersService.findUserById(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // 🚨 Error handling
    }
  }

  /**
   * ✏️ Update current user details
   * @param updateData - The data to update
   * @returns Updated user details
   */
  @Put('me')
  @HttpCode(HttpStatus.OK)
  async updateMe(@Req() req: any, @Body() updateData: UpdateUserDto) {
    const userId = req.user.id;
    try {
      return await this.usersService.updateUser(userId, updateData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // 🚨 Error handling
    }
  }

  /**
   * 🚦 Change the current user's status
   * @param body - The new status
   * @returns Success message with updated user status
   */
  @Put('me/status')
  @HttpCode(HttpStatus.OK)
  async changeStatus(@Req() req: any, @Body() body: ChangeStatusDto) {
    const userId = req.user.id;
    const { status } = body;

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
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // 🚨 Error handling
    }
  }

  /**
   * ⚙️ Update current user's settings
   * @param settingsData - The new settings
   * @returns Success message with updated settings
   */
  @Patch('me/settings')
  @HttpCode(HttpStatus.OK)
  async updateSettings(
    @Req() req: any,
    @Body() settingsData: UpdateSettingsDto,
  ) {
    const userId = req.user.id;

    if (!settingsData || Object.keys(settingsData).length === 0) {
      throw new BadRequestException('No settings data provided'); // 🚫 Validation error
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
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // 🚨 Error handling
    }
  }

  /**
   * 🔍 Get current user's settings
   * @returns Current user's settings
   */
  @Get('me/settings')
  @HttpCode(HttpStatus.OK)
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
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // 🚨 Error handling
    }
  }

  /**
   * 📱 Save a new device token for the current user
   * @param body - The device token
   * @returns Success message with updated user data
   */
  @Put('me/device-token')
  @HttpCode(HttpStatus.OK)
  async saveDeviceToken(@Req() req: any, @Body() body: DeviceTokenDto) {
    const userId = req.user.id;
    const { deviceToken } = body;

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
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // 🚨 Error handling
    }
  }

  /**
   * 📱 Get the current user's device token
   * @returns The device token
   */
  @Get('me/device-token')
  @HttpCode(HttpStatus.OK)
  async getDeviceToken(@Req() req: any) {
    const userId = req.user.id;

    try {
      const deviceToken = await this.usersService.getDeviceToken(userId);
      if (!deviceToken) {
        throw new NotFoundException('Device token not found'); // 🚫 Token not found
      }
      return {
        status: 'success',
        message: 'Device token retrieved successfully',
        data: { deviceToken },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // 🚨 Error handling
    }
  }

  /**
   * 🖼️ Get the current user's profile picture
   * @returns The profile picture URL
   */
  @Get('me/profile-picture')
  @HttpCode(HttpStatus.OK)
  async getProfilePicture(@Req() req: any) {
    const userId = req.user.id;

    try {
      const profilePicture = await this.usersService.getProfilePicture(userId);
      if (!profilePicture) {
        throw new NotFoundException('Profile picture not found'); // 🚫 Picture not found
      }
      return {
        status: 'success',
        message: 'Profile picture retrieved successfully',
        data: { profilePicture },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // 🚨 Error handling
    }
  }

  /**
   * 🖼️ Upload and update the current user's profile picture
   * @param file - The uploaded file
   * @returns Success message with updated user data
   */
  @Put('me/profile-picture')
  @UseInterceptors(FileInterceptor('file', fileUploadOptions)) // 📂 Handle file upload
  @HttpCode(HttpStatus.OK)
  async uploadProfilePicture(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded'); // 🚫 Validation error
    }

    const fileUrl = `/uploads/profile-pictures/${file.filename}`; // 📂 File path

    try {
      const updatedUser = await this.usersService.updateProfilePicture(
        req.user.id,
        fileUrl,
      );
      return {
        status: 'success',
        message: 'Profile picture uploaded successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // 🚨 Error handling
    }
  }
}

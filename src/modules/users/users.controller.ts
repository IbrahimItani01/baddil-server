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
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions } from 'src/utils/modules/config/file-upload.config';

// 🛡️ Apply guards to protect the routes
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {} // 💉 Injecting UsersService

  /**
   * 📜 Get the current user's information
   * @param req - The request object containing user information.
   * @returns The user's information.
   */
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: any) {
    const userId = req.user.id; // 🆔 Extract user ID from the request
    try {
      return await this.usersService.findUserById(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // 🚨 Handle errors
    }
  }

  /**
   * 📜 Update the current user's information
   * @param req - The request object containing user information.
   * @param updateData - The data to update the user with.
   * @returns The updated user information.
   */
  @Put('me')
  @HttpCode(HttpStatus.OK)
  async updateMe(@Req() req: any, @Body() updateData: any) {
    const userId = req.user.id; // 🆔 Extract user ID from the request
    try {
      return await this.usersService.updateUser(userId, updateData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // 🚨 Handle errors
    }
  }

  /**
   * 📜 Change the current user's status
   * @param req - The request object containing user information.
   * @param body - The body containing the new status.
   * @returns The updated user information.
   */
  @Put('me/status')
  @HttpCode(HttpStatus.OK)
  async changeStatus(@Req() req: any, @Body() body: { status: string }) {
    const userId = req.user.id; // 🆔 Extract user ID from the request
    const { status } = body;

    if (!status) {
      throw new BadRequestException('Status is required'); // 🚫 Missing status
    }

    try {
      const updatedUser = await this.usersService.changeUserStatus(userId, status);
      return {
        status: 'success',
        message: 'User status updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // 🚨 Handle errors
    }
  }

  /**
   * 📜 Update the current user's settings
   * @param req - The request object containing user information.
   * @param settingsData - The settings data to update.
   * @returns The updated settings.
   */
  @Patch('me/settings')
  @HttpCode(HttpStatus.OK)
  async updateSettings(@Req() req: any, @Body() settingsData: any) {
    const userId = req.user.id; // 🆔 Extract user ID from the request

    if (!settingsData || Object.keys(settingsData).length === 0) {
      throw new BadRequestException('No settings data provided'); // 🚫 Missing settings data
    }

    try {
      const updateResult = await this.usersService.updateSettings(userId, settingsData);
      return {
        status: 'success',
        message: 'Settings updated successfully',
        data: updateResult.data,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // 🚨 Handle errors
    }
  }

  /**
   * 📜 Get the current user's settings
   * @param req - The request object containing user information.
   * @returns The user's settings.
   */
  @Get('me/settings')
  @HttpCode(HttpStatus.OK)
  async getUserSettings(@Req() req: any) {
    const userId = req.user.id; // 🆔 Extract user ID from the request

    try {
      const settings = await this.usersService.getUserSettings(userId);
      return {
        status: 'success',
        message: 'User settings retrieved successfully',
        data: settings,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // 🚨 Handle errors
    }
  }

  /**
   * 📜 Save the current user's device token
   * @param req - The request object containing user information.
   * @param body - The body containing the device token.
   * @returns The updated user information.
   */
  @Put('me/device-token')
  @HttpCode(HttpStatus.OK)
  async saveDeviceToken(@Req() req: any, @Body() body: { deviceToken: string }) {
    const userId = req.user.id; // 🆔 Extract user ID from the request
    const { deviceToken } = body;

    if (!deviceToken) {
      throw new BadRequestException('Device token is required'); // 🚫 Missing device token
    }

    try {
      const updatedUser = await this.usersService.updateDeviceToken(userId, deviceToken);
      return {
        status: 'success',
        message: 'Device token updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // 🚨 Handle errors
    }
  }

  /**
   * 📜 Get the current user's device token
   * @param req - The request object containing user information.
   * @returns The user's device token.
   */
  @Get('me/device-token')
  @HttpCode(HttpStatus.OK)
  async getDeviceToken(@Req() req: any) {
    const userId = req.user.id; // 🆔 Extract user ID from the request

    try {
      const deviceToken = await this.usersService.getDeviceToken(userId);
      if (!deviceToken) {
        throw new NotFoundException('Device token not found'); // 🚫 Device token missing
      }
      return {
        status: 'success',
        message: 'Device token retrieved successfully',
        data: { deviceToken },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // 🚨 Handle errors
    }
  }

  /**
   * 📜 Get the current user's profile picture
   * @param req - The request object containing user information.
   * @returns The user's profile picture.
   */
  @Get('me/profile-picture')
  @HttpCode(HttpStatus.OK)
  async getProfilePicture(@Req() req: any) {
    const userId = req.user.id; // 🆔 Extract user ID from the request

    try {
      const profilePicture = await this.usersService.getProfilePicture(userId);
      if (!profilePicture) {
        throw new NotFoundException('Profile picture not found'); // 🚫 Profile picture missing
      }
      return {
        status: 'success',
        message: 'Profile picture retrieved successfully',
        data: { profilePicture },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // 🚨 Handle errors
    }
  }

  /**
   * 📜 Upload a new profile picture for the current user
   * @param req - The request object containing user information.
   * @param file - The uploaded file.
   * @returns The updated user information.
   */
  @Put('me/profile-picture')
  @UseInterceptors(FileInterceptor('file', fileUploadOptions))
  @HttpCode(HttpStatus.OK)
  async uploadProfilePicture(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded'); // 🚫 Missing file
    }

    const fileUrl = `/uploads/profile-pictures/${file.filename}`; // 📂 Construct file URL

    try {
      const updatedUser = await this.usersService.updateProfilePicture(req.user.id, fileUrl);
      return {
        status: 'success',
        message: 'Profile picture uploaded successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // 🚨 Handle errors
    }
  }
}

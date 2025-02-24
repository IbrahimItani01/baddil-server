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
  Param,
  Post,
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
import { ApiResponse } from 'src/utils/api/apiResponse.interface';
import { findUserByEmail } from 'src/utils/modules/users/users.utils';
import { PrismaService } from 'src/database/prisma.service';
import { OptionalJwtAuthGuard } from 'src/guards/optionalJwt.guard';
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard';

// 🔐 Applying the JWT guard to all routes in this controller
@Controller('users') // 📂 Base route for user-related operations
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {} // 💉 Injecting the UsersService and prismaService

  /**
   * 🛠️ Get current user details
   * @returns Current user's details
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: any): Promise<ApiResponse> {
    const userId = req.user.id;

    const user = await this.usersService.findUserById(userId);
    return {
      success: true,
      message: 'User found',
      data: user,
    };
  }

  /**
   * ✏️ Update current user details
   * @param updateData - The data to update
   * @returns Updated user details
   */
  @UseGuards(JwtAuthGuard)
  @Put('me')
  @HttpCode(HttpStatus.OK)
  async updateMe(
    @Req() req: any,
    @Body() updateData: UpdateUserDto,
  ): Promise<ApiResponse> {
    const userId = req.user.id;

    await this.usersService.updateUser(userId, updateData);
    return {
      success: true,
      message: 'User updated',
    };
  }

  /**
   * 🚦 Change the current user's status
   * @param body - The new status
   * @returns Success message with updated user status
   */
  @UseGuards(JwtAuthGuard)
  @Put('me/status')
  @HttpCode(HttpStatus.OK)
  async changeStatus(
    @Req() req: any,
    @Body() body: ChangeStatusDto,
  ): Promise<ApiResponse> {
    const userId = req.user.id;
    const { status } = body;

    const updatedUser = await this.usersService.changeUserStatus(
      userId,
      status,
    );
    return {
      success: true,
      message: 'User status updated successfully',
      data: updatedUser,
    };
  }

  /**
   * ⚙️ Update current user's settings
   * @param settingsData - The new settings
   * @returns Success message with updated settings
   */
  @UseGuards(JwtAuthGuard)
  @Patch('me/settings')
  @HttpCode(HttpStatus.OK)
  async updateSettings(
    @Req() req: any,
    @Body() settingsData: UpdateSettingsDto,
  ): Promise<ApiResponse> {
    const userId = req.user.id;

    if (!settingsData || Object.keys(settingsData).length === 0) {
      throw new BadRequestException('No settings data provided'); // 🚫 Validation error
    }

    const updateResult = await this.usersService.updateSettings(
      userId,
      settingsData,
    );
    return {
      success: true,
      message: 'Settings updated successfully',
      data: updateResult.data,
    };
  }

  /**
   * 🔍 Get current user's settings
   * @returns Current user's settings
   */
  @UseGuards(JwtAuthGuard)
  @Get('me/settings')
  @HttpCode(HttpStatus.OK)
  async getUserSettings(@Req() req: any): Promise<ApiResponse> {
    const userId = req.user.id;

    const settings = await this.usersService.getUserSettings(userId);
    return {
      success: true,
      message: 'User settings retrieved successfully',
      data: settings,
    };
  }

  /**
   * 📱 Save a new device token for the current user
   * @param body - The device token
   * @returns Success message with updated user data
   */
  @UseGuards(JwtAuthGuard)
  @Put('me/device-token')
  @HttpCode(HttpStatus.OK)
  async saveDeviceToken(
    @Req() req: any,
    @Body() body: DeviceTokenDto,
  ): Promise<ApiResponse> {
    const userId = req.user.id;
    const { deviceToken } = body;

    const updatedUser = await this.usersService.updateDeviceToken(
      userId,
      deviceToken,
    );
    return {
      success: true,
      message: 'Device token updated successfully',
      data: updatedUser,
    };
  }

  /**
   * 📱 Get the current user's device token
   * @returns The device token
   */
  @UseGuards(JwtAuthGuard)
  @Get('me/device-token')
  @HttpCode(HttpStatus.OK)
  async getDeviceToken(@Req() req: any): Promise<ApiResponse> {
    const userId = req.user.id;

    const deviceToken = await this.usersService.getDeviceToken(userId);
    if (!deviceToken) {
      throw new NotFoundException('Device token not found'); // 🚫 Token not found
    }
    return {
      success: true,
      message: 'Device token retrieved successfully',
      data: { deviceToken },
    };
  }

  /**
   * 🖼️ Get the current user's profile picture
   * @returns The profile picture URL
   */
  @UseGuards(OptionalJwtAuthGuard)
  @Get('profile-picture/:identifier?')
  async serveProfilePicture(
    @Param('identifier') identifier: string,
    @Req() req: any,
  ): Promise<ApiResponse> {
    let userId: string;

    if (req.user?.id) {
      userId = req.user.id;
    } else {
      const user = await findUserByEmail(this.prisma, identifier);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      userId = user.id;
    }

    // Get the profile picture URL
    const profilePictureUrl = await this.usersService.getProfilePicture(userId);

    return {
      success: true,
      message: 'Profile picture fetched successfully',
      data: profilePictureUrl, // Send the URL to the frontend
    };
  }

  /**
   * 🖼️ Upload and update the current user's profile picture
   * @param file - The uploaded file
   * @returns Success message with updated user data
   */
  @UseGuards(JwtAuthGuard)
  @Put('me/profile-picture')
  @UseInterceptors(FileInterceptor('file', fileUploadOptions)) // 📂 Handle file upload
  @HttpCode(HttpStatus.OK)
  async uploadProfilePicture(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ApiResponse> {
    if (!file) {
      throw new BadRequestException('No file uploaded'); // 🚫 Validation error
    }

    const fileUrl = `uploads/profile-pictures/${req.user.id}/${file.filename}`; // 📂 File path

    const updatedUser = await this.usersService.updateProfilePicture(
      req.user.id,
      fileUrl,
    );
    return {
      success: true,
      message: 'Profile picture uploaded successfully',
      data: updatedUser,
    };
  }
  /**
   * 📨 Check if email exists
   * @param body - The email to check
   * @returns Success or error message
   */
  @Post('check-email')
  @HttpCode(HttpStatus.OK)
  async checkEmail(@Body() body): Promise<ApiResponse> {
    const { email } = body;
    const user = await this.usersService.findByEmail(email);
    if (user) {
      return {
        success: true,
        message: 'Email exists in the database',
        data: user,
      };
    }
  }

  /**
   * 🔍 Get all users grouped by type (Admin only)
   * @returns Users grouped by user types
   */
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  @Get('users-by-type')
  @AllowedUserTypes('admin') // 🛡 Restrict access to admins
  @HttpCode(HttpStatus.OK)
  async getAllUsersByType(): Promise<ApiResponse> {
    const result = await this.usersService.findAllUsersByType();
    return {
      success: true,
      message: 'Users grouped by type fetched successfully',
      data: result,
    };
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../../database/prisma.service';
import { User } from '@prisma/client';
import {
  getUserStatusId,
  getUserTypeId,
} from 'src/utils/modules/users/users.utils';
import {
  createUserSettings,
  getSettingsById,
  getSettingsId,
  validateSettingsData,
} from 'src/utils/modules/users/settings.utils';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateSettingsDto,
} from './dto/users.dto';
import { handleError } from 'src/utils/general/error.utils';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {} // 🚀 Injecting PrismaService for database operations

  // 🔍 Find user by email
  async findByEmail(email: string): Promise<User | null> {
    try {
      return this.prisma.user.findFirst({ where: { email } }); // 📧 Search for a user by email
    } catch (error) {
      handleError(error, 'failed to find user by email');
    }
  }

  // 🔍 Find user by Firebase UID
  async findByFirebaseUid(firebase_uid: string): Promise<User | null> {
    try {
      return this.prisma.user.findFirst({ where: { firebase_uid } }); // 🔑 Search for a user by Firebase UID
    } catch (error) {
      handleError(error, 'failed to find user by firebase_uid');
    }
  }

  // 🆕 Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const {
        firebase_uid,
        email,
        password,
        user_type,
        language,
        theme,
        ...rest
      } = createUserDto;

      // ⚠️ Check if user already exists
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ email }, { firebase_uid }],
        },
      });

      if (existingUser) {
        throw new BadRequestException(
          'User already exists with this email or Firebase UID',
        );
      }

      // 🔒 Hash the password if provided
      const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : undefined;

      // 🎯 Get user type and status IDs
      const userTypeId = await getUserTypeId(this.prisma, user_type);
      const userStatusId = await getUserStatusId(this.prisma, 'active');

      // 🛠️ Create default user settings
      const newSetting = await createUserSettings(this.prisma, language, theme);

      // 📝 Create the user in the database
      return await this.prisma.user.create({
        data: {
          firebase_uid,
          email,
          password: hashedPassword,
          user_type_id: userTypeId,
          user_status_id: userStatusId,
          settings_id: newSetting.id,
          ...rest,
        },
      });
    } catch (error) {
      handleError(error, 'failed to create user');
    }
  }

  // 🔍 Find user by ID with selected fields
  async findUserById(userId: string): Promise<Partial<User> | null> {
    try {
      return this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          profile_picture: true,
          firebase_uid: true,
          device_token: true,
          is_deleted: true,
          user_type_id: true,
          user_status_id: true,
          settings_id: true,
          subscription_id: true,
          tier_id: true,
        },
      });
    } catch (error) {
      handleError(error, 'failed to find user');
    }
  }

  // 🔄 Update user details
  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: updateUserDto,
      });

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      return updatedUser;
    } catch (error) {
      handleError(error, 'failed to update user');
    }
  }

  // 🔄 Update user settings
  async updateSettings(
    userId: string,
    updateSettingsDto: UpdateSettingsDto,
  ): Promise<any> {
    try {
      const settingsId = await getSettingsId(this.prisma, userId);

      if (!settingsId) {
        throw new NotFoundException('User settings not found');
      }

      const currentSettings = await getSettingsById(this.prisma, settingsId);
      const updateData = validateSettingsData(updateSettingsDto);

      if (Object.keys(updateData).length === 0) {
        throw new BadRequestException('No valid settings data to update');
      }

      return await this.prisma.setting.update({
        where: { id: currentSettings.id },
        data: updateData,
      });
    } catch (error) {
      handleError(error, 'Failed to update settings');
    }
  }

  // 🔄 Update device token
  async updateDeviceToken(userId: string, deviceToken: string): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: { device_token: deviceToken },
      });
    } catch (error) {
      handleError(error, 'Error updating device token');
    }
  }

  // 🔍 Fetch user's device token
  async getDeviceToken(userId: string): Promise<string | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { device_token: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user.device_token;
    } catch (error) {
      handleError(error, 'Error fetching device token');
    }
  }

  // 🔍 Fetch user settings
  async getUserSettings(userId: string): Promise<any> {
    try {
      const settingsId = await getSettingsId(this.prisma, userId);

      if (!settingsId) {
        throw new NotFoundException('User settings not found');
      }

      return await getSettingsById(this.prisma, settingsId);
    } catch (error) {
      handleError(error, 'Error fetching user settings');
    }
  }

  // 🔄 Change user status
  async changeUserStatus(userId: string, status: string): Promise<User> {
    try {
      const statusId = await getUserStatusId(this.prisma, status);

      if (!statusId) {
        throw new NotFoundException(`Status '${status}' not found`);
      }

      return await this.prisma.user.update({
        where: { id: userId },
        data: { user_status_id: statusId },
      });
    } catch (error) {
      handleError(error, 'failed to change user status');
    }
  }

  // 🔍 Get profile picture URL
  async getProfilePicture(userId: string): Promise<{ url: string; file: any }> {
    try {
      const user = await this.findUserById(userId);

      if (!user || !user.profile_picture) {
        throw new NotFoundException('Profile picture not found');
      }

      // Construct the file path
      const filePath = path.join(
        process.cwd(),
        'uploads',
        user.profile_picture.replace('/uploads/', ''),
      );
      console.log(user.profile_picture);

      // Create a stream to the file
      const fileStream = fs.createReadStream(filePath);

      return {
        url: user.profile_picture,
        file: fileStream, // Return the file stream
      };
    } catch (error) {
      handleError(error, 'Error fetching profile picture');
    }
  }

  // 🔄 Update profile picture
  async updateProfilePicture(
    userId: string,
    profilePictureUrl: string,
  ): Promise<User> {
    try {
      const user = await this.findUserById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // 🗑️ Remove old profile picture if it exists
      if (user.profile_picture) {
        // Convert the relative URL to an absolute file path
        const oldFilePath = path.join(
          process.cwd(), // Get the root directory
          'uploads',
          user.profile_picture.replace('/uploads/', ''), // Remove the base URL part
        );

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath); // Delete the old profile picture
        }
      }

      // Update the user's profile picture in the database
      return await this.prisma.user.update({
        where: { id: userId },
        data: { profile_picture: profilePictureUrl },
      });
    } catch (error) {
      handleError(error, 'failed updating profile picture');
    }
  }
}

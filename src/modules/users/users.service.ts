import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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
import * as fs from 'fs';
import path from 'path';

@Injectable() // 💉 Marking the service as Injectable for dependency injection
export class UsersService {
  constructor(private readonly prisma: PrismaService) {} // 🔌 Injecting PrismaService for database operations

  /**
   * 📧 Find user by email
   * @param email - User's email address
   * @returns The user object or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      return this.prisma.user.findFirst({ where: { email } });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Error finding user by email'); // 🚨 Catch and handle errors
    }
  }

  /**
   * 🔥 Find user by Firebase UID
   * @param firebase_uid - Firebase UID of the user
   * @returns The user object or null if not found
   */
  async findByFirebaseUid(firebase_uid: string): Promise<User | null> {
    try {
      return this.prisma.user.findFirst({ where: { firebase_uid } });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException(
        'Error finding user by Firebase UID',
      );
    }
  }

  /**
   * 🆕 Create a new user
   * @param userData - Data required for creating a user
   * @returns The newly created user
   */
  async create(userData: {
    firebase_uid: string;
    name: string;
    email: string;
    user_type: string;
    profile_picture?: string;
    password?: string;
    language?: string;
    theme?: string;
  }): Promise<User> {
    try {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: userData.email },
            { firebase_uid: userData.firebase_uid },
          ],
        },
      });

      if (existingUser) {
        throw new BadRequestException(
          'User already exists with this email or Firebase UID',
        ); // 🚫 Handle duplicate users
      }

      if (userData.password) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
      }

      const userTypeId = await getUserTypeId(this.prisma, userData.user_type);
      const userStatusId = await getUserStatusId(this.prisma, 'active');
      const newSetting = await createUserSettings(
        this.prisma,
        userData.language,
        userData.theme,
      );

      return await this.prisma.user.create({
        data: {
          firebase_uid: userData.firebase_uid,
          name: userData.name,
          email: userData.email,
          profile_picture: userData.profile_picture,
          password: userData.password,
          user_type_id: userTypeId,
          user_status_id: userStatusId,
          settings_id: newSetting.id,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Error creating user'); // 🛠️ Handle generic errors
    }
  }

  /**
   * 🔍 Find user by ID
   * @param userId - ID of the user
   * @returns Partial user details or null if not found
   */
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Error finding user by ID');
    }
  }

  /**
   * ✏️ Update user details
   * @param userId - ID of the user
   * @param updateData - Data to update
   * @returns Updated user object or null
   */
  async updateUser(
    userId: string,
    updateData: Partial<User>,
  ): Promise<User | null> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      if (!updatedUser) {
        throw new NotFoundException('User not found'); // 🚫 Handle missing user
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update user'); // 🚨 Handle update errors
    }
  }

  /**
   * ⚙️ Update user settings
   * @param userId - ID of the user
   * @param settingsData - New settings data
   * @returns Success message with updated settings
   */
  async updateSettings(
    userId: string,
    settingsData: {
      language?: string;
      theme?: string;
      notifications?: boolean;
    },
  ): Promise<any> {
    try {
      const settingsId = await getSettingsId(this.prisma, userId);

      if (!settingsId) {
        throw new NotFoundException('User settings not found'); // 🚫 Handle missing settings
      }

      const currentSettings = await getSettingsById(this.prisma, settingsId);
      const updateData = validateSettingsData(settingsData);

      if (Object.keys(updateData).length === 0) {
        throw new BadRequestException('No valid settings data to update'); // 🚫 Handle empty updates
      }

      return await this.prisma.setting.update({
        where: { id: currentSettings.id },
        data: updateData,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Failed to update settings'); // 🚨 Handle generic errors
    }
  }

  /**
   * 📱 Update device token
   * @param userId - ID of the user
   * @param deviceToken - New device token
   * @returns Updated user object
   */
  async updateDeviceToken(userId: string, deviceToken: string): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: { device_token: deviceToken },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Error updating device token');
    }
  }

  /**
   * 📱 Get device token
   * @param userId - ID of the user
   * @returns The user's device token
   */
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Error fetching device token');
    }
  }

  /**
   * ⚙️ Get user settings
   * @param userId - ID of the user
   * @returns The user's settings
   */
  async getUserSettings(userId: string): Promise<any> {
    try {
      const settingsId = await getSettingsId(this.prisma, userId);

      if (!settingsId) {
        throw new NotFoundException('User settings not found');
      }

      return await getSettingsById(this.prisma, settingsId);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user settings');
    }
  }

  /**
   * 🚦 Change user status
   * @param userId - ID of the user
   * @param status - New status for the user
   * @returns Updated user object
   */
  async changeUserStatus(userId: string, status: string): Promise<User> {
    try {
      // Get the status ID from the status string
      const statusId = await getUserStatusId(this.prisma, status);

      if (!statusId) {
        throw new NotFoundException(`Status '${status}' not found`); // 🚫 Handle invalid status
      }

      // Update the user's status ID
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { user_status_id: statusId },
      });

      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to change user status'); // 🚨 Handle generic errors
    }
  }

  /**
   * 🖼️ Get user profile picture
   * @param userId - ID of the user
   * @returns The profile picture URL or null
   */
  async getProfilePicture(userId: string): Promise<string | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { profile_picture: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user.profile_picture; // Return the profile picture URL
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Error fetching profile picture');
    }
  }

  /**
   * 🖼️ Update user profile picture
   * @param userId - ID of the user
   * @param profilePictureUrl - New profile picture URL
   * @returns Updated user object
   */
  async updateProfilePicture(
    userId: string,
    profilePictureUrl: string,
  ): Promise<User> {
    try {
      // Check if the user exists
      const user = await this.prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // If the user has an old profile picture, delete it
      if (user.profile_picture) {
        const oldFilePath = path.join(
          __dirname,
          '..',
          'uploads',
          user.profile_picture,
        );
        // Check if the old file exists and delete it
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath); // Delete old file
        }
      }

      // Update the user's profile picture URL in the database
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { profile_picture: profilePictureUrl },
      });

      return updatedUser;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Error updating profile picture');
    }
  }
}

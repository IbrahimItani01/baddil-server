import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { email } });
  }

  async findByFirebaseUid(firebase_uid: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { firebase_uid } });
  }

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
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { firebase_uid: userData.firebase_uid },
        ],
      },
    });

    if (existingUser) {
      throw new Error('User already exists with this email or Firebase UID');
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

    const newUser = await this.prisma.user.create({
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

    return newUser;
  }

  async findUserById(userId: number): Promise<Partial<User> | null> {
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
  }

  async updateUser(
    userId: number,
    updateData: Partial<User>,
  ): Promise<User | null> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update user');
    }
  }

  async updateSettings(
    userId: number,
    settingsData: {
      language?: string;
      theme?: string;
      notifications?: boolean;
    },
  ): Promise<any> {
    try {
      const settingsId = await getSettingsId(this.prisma, userId);

      if (!settingsId) {
        throw new NotFoundException('User settings not found');
      }

      const currentSettings = await getSettingsById(this.prisma, settingsId);

      const updateData = validateSettingsData(settingsData);

      if (Object.keys(updateData).length === 0) {
        throw new BadRequestException('No valid settings data to update');
      }

      const updatedSetting = await this.prisma.setting.update({
        where: { id: currentSettings.id },
        data: updateData,
      });

      return {
        status: 'success',
        message: 'Settings updated successfully',
        data: updatedSetting,
      };
    } catch (error) {
      throw new BadRequestException('Failed to update settings', error.message);
    }
  }

  async updateDeviceToken(userId: number, deviceToken: string): Promise<User> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { device_token: deviceToken },
    });
  }

  async getDeviceToken(userId: number): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { device_token: true }, // Only select the device token field
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.device_token; // Return the device token if available
  }
}

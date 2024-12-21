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

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByFirebaseUid(firebaseUid: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ firebase_uid: firebaseUid }).exec();
  }

  async create(userData: {
    firebase_uid: string;
    name: string;
    email: string;
    user_type: string;
    profile_picture?: string;
    password?: string;
  }): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({
      $or: [{ email: userData.email }, { firebase_uid: userData.firebase_uid }],
    });

    if (existingUser) {
      throw new Error('User already exists with this email or Firebase UID');
    }

    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;
    }

    const newUser = new this.userModel({
      ...userData,
    });

    return newUser.save();
  }

  async findUserById(userId: string): Promise<Partial<User> | null> {
    return this.userModel.findById(userId, '-password').lean().exec();
  }

  async updateUser(
    userId: string,
    updateData: Partial<User>,
  ): Promise<User | null> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          userId,
          { $set: updateData },
          { new: true, runValidators: true },
        )
        .lean()
        .exec();

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      return updatedUser;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Failed to update user');
    }
  }
  
}

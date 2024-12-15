import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/database/schemas/users.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
      ) {}

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

    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async findUserById(userId: string): Promise<Partial<User> | null> {
    return this.userModel.findById(userId, '-password').lean().exec();
  }
}

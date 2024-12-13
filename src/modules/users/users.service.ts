import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { User, UserDocument } from 'src/database/schemas/users.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
      ) {}
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
  async createUser(userData: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }
}

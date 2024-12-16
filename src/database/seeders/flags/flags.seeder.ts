import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import { FlagTypeEnum, FlagStatusEnum } from '../../../utils/enums.utils';
import { Flag, FlagDocument } from '../../schemas/flags.schema';
import { Barter, BarterDocument } from '../../schemas/barters.schema';
import { User, UserDocument } from '../../schemas/users.schema';

@Injectable()
export class FlagsSeeder {
  constructor(
    @InjectModel(Flag.name) private flagModel: Model<FlagDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Barter.name) private barterModel: Model<BarterDocument>,
  ) {}

  getModel(): Model<FlagDocument> {
    return this.flagModel;
  }

  async seed() {
    const existingFlags = await this.flagModel.countDocuments();
    if (existingFlags > 0) {
      return;
    }

    const users = await this.userModel.find(
      { user_type: { $in: ['broker', 'barterer'] } },
      '_id',
    );
    const userIds = users.map((user) => user._id);

    const barters = await this.barterModel.find({}, '_id');
    const barterIds = barters.map((barter) => barter._id);

    const admins = await this.userModel.find({ user_type: 'Admin' }, '_id');
    const adminIds = admins.map((admin) => admin._id);

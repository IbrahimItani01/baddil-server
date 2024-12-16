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


import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Barterer, BartererDocument } from 'src/database/schemas/barterers.schema';
import { User, UserDocument } from 'src/database/schemas/users.schema';
import { AutoTradeStatusEnum, ItemConditionEnum } from 'src/utils/enums.utils';
import { Broker, BrokerDocument } from 'src/database/schemas/brokers.schema';

@Injectable()
export class BarterersSeeder {
  constructor(
    @InjectModel(Barterer.name) private readonly bartererModel: Model<BartererDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Broker.name) private readonly brokerModel: Model<BrokerDocument>,
  ) {}

  async seedBarterers(): Promise<BartererDocument[]> {
    const bartererUsers = await this.userModel.find({ user_type: 'barterer' });

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Broker, BrokerDocument } from '../../schemas/brokers.schema';
import { User, UserDocument } from '../../schemas/users.schema';
import {
  Earnings,
  Performance,
  VipStatus,
} from '../../subSchemas/brokers.subSchema';
import {
  ItemConditionEnum,
  ClientStatusEnum,
  RatingEnum,
} from '../../../utils/enums.utils';
import { v4 as uuidv4 } from 'uuid';
import { Barterer, BartererDocument } from '../../schemas/barterers.schema';

@Injectable()
export class BrokersSeeder {
  constructor(
    @InjectModel(Broker.name)private readonly brokerModel: Model<BrokerDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Barterer.name)private readonly bartererModel: Model<BartererDocument>,
  ) {}

  getModel(): Model<BrokerDocument> {
    return this.brokerModel;
  }

  async seed(): Promise<BrokerDocument[]> {
    const brokerUsers = await this.userModel.find({ user_type: 'broker' });

    const brokers = await Promise.all(
      brokerUsers.map(async (user) => {
        const barterer = await this.bartererModel.findOne({
          'hired_brokers.broker_id': user._id,
        });

        if (!barterer) {
          console.error("⚠️ Error in finding seeded barterer");
          return null;
        }

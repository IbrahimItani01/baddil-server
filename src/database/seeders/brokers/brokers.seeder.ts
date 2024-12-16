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

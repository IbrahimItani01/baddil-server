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

        const brokerData = {
          user_id: user._id as Types.ObjectId,
          rate_per_hour: faker.number.int({ min: 50, max: 200 }),
          vip_status: {
            is_vip: faker.datatype.boolean(),
            validated_at: faker.datatype.boolean() ? faker.date.recent() : null,
          } as VipStatus,
          performance: {
            success_rate: faker.number.float({ min: 0, max: 100 }),
            completed_barters: faker.number.int({ min: 0, max: 100 }),
            earnings: {
              total: faker.number.int({ min: 1000, max: 10000 }),
              from_clients: faker.number.int({ min: 500, max: 5000 }),
              from_baddil: faker.number.int({ min: 200, max: 2000 }),
            } as Earnings,
          } as Performance,
          clients: Array.from({
            length: faker.number.int({ min: 1, max: 5 }),
          }).map(() => ({
            client_id: barterer
              ? (barterer._id as Types.ObjectId)
              : new Types.ObjectId(),
            budget: faker.number.int({ min: 100, max: 10000 }),
            client_goal: {
              name: faker.commerce.productName(),
              condition: faker.helpers.arrayElement(
                Object.values(ItemConditionEnum),
              ),
              category: faker.commerce.department(),
              details: faker.lorem.sentence(),
            },
            client_item: {
              barter_id: new Types.ObjectId(),
              name: faker.commerce.productName(),
              condition: faker.helpers.arrayElement(
                Object.values(ItemConditionEnum),
              ),
              category: faker.commerce.department(),
            },
            process: Array.from({
              length: faker.number.int({ min: 1, max: 3 }),
            }).map(() => ({
              process_id: uuidv4(),
              title: faker.lorem.words(3),
              from_barter_id: new Types.ObjectId(),
              to_barter_id: new Types.ObjectId(),
              details: faker.lorem.sentence(),
            })),
            progress: faker.number.float({ min: 0, max: 100 }),
            status: faker.helpers.arrayElement(Object.values(ClientStatusEnum)),
            created_at: faker.date.past(),
            updated_at: faker.date.recent(),
          })),
          ratings: Array.from({
            length: faker.number.int({ min: 0, max: 5 }),
          }).map(() => ({
            client_id: barterer
              ? (barterer._id as Types.ObjectId)
              : new Types.ObjectId(),
            rating: faker.helpers.arrayElement(
              Object.values(RatingEnum),
            ) as RatingEnum,
            message: faker.lorem.sentence(),
            date: faker.date.past(),
          })),
          chats_history: Array.from({
            length: faker.number.int({ min: 1, max: 3 }),
          }).map(() => new Types.ObjectId()),
          barters: Array.from({
            length: faker.number.int({ min: 1, max: 3 }),
          }).map(() => new Types.ObjectId()),
        };

        return brokerData;
      }),
    );

    const seededBrokers = await this.brokerModel.insertMany(
      brokers.filter((broker) => broker !== null),
    );
    console.log(`✅ ${seededBrokers.length} brokers have been seeded!`);
    return seededBrokers;
  }
}

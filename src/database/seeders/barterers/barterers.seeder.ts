import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Barterer, BartererDocument } from '../../schemas/barterers.schema';
import { User, UserDocument } from '../../schemas/users.schema';
import {
  AutoTradeStatusEnum,
  ItemConditionEnum,
} from '../../../utils/enums.utils';
import { Broker, BrokerDocument } from '../../schemas/brokers.schema';

@Injectable()
export class BarterersSeeder {
  constructor(
    @InjectModel(Barterer.name) private readonly bartererModel: Model<BartererDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Broker.name) private readonly brokerModel: Model<BrokerDocument>,
  ) {}

  async seedBarterers(): Promise<BartererDocument[]> {
    const bartererUsers = await this.userModel.find({ user_type: 'barterer' });

    const barterers = await Promise.all(
      bartererUsers.map(async (user) => {
        const bartererData = await this.bartererModel.findOne({ user_id: user._id });
        if (!bartererData) {
          return null;
        }

        const brokers = await this.brokerModel.find();
        const isPro = bartererData.pro_status.is_pro;

        // Generate wallet items
        const walletItems = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(() => ({
          item_id: new Types.ObjectId(),
          name: faker.commerce.productName(),
          category: faker.commerce.department(),
          condition: faker.helpers.arrayElement([ItemConditionEnum.New, ItemConditionEnum.Refurbished, ItemConditionEnum.Used]),
          description: faker.commerce.productDescription(),
          estimated_value: faker.number.int({ min: 10, max: 1000 }),
          created_at: faker.date.past(),
          images: [faker.image.url()],
        }));

        const walletItemIds = walletItems.map((item) => item.item_id);

        // Determine hired brokers
        const hiredBrokers = (isPro ? brokers.slice(0, faker.number.int({ min: 1, max: 5 })) : brokers.slice(0, 1)).map(
          (broker) => ({
            broker_id: broker._id as Types.ObjectId,
            hired_on: faker.date.past(),
            contract_termination_date: faker.date.future(),
            goal_to_barter: faker.commerce.productName(),
            starting_item_id: faker.helpers.arrayElement(walletItemIds), // Pick an actual wallet item ID
            contract_budget: faker.number.int({ min: 100, max: 1000 }),
          }),
        );

        const barterer = {
          user_id: user._id as Types.ObjectId,
          pro_status: {
            is_pro: isPro,
            activated_on: isPro ? faker.date.recent() : undefined,
            expires_on: isPro ? faker.date.future() : undefined,
            plan_id: bartererData.pro_status.plan_id || new Types.ObjectId(),
          },
          tier: {
            current_tier: new Types.ObjectId(),
            progress: faker.number.int({ min: 0, max: 100 }),
            trades_left: faker.number.int({ min: 0, max: 10 }),
            date_reached: faker.date.past(),
            next_tier: new Types.ObjectId(),
          },
          wallet: {
            items: walletItems,
            total_value: walletItems.reduce((acc, item) => acc + item.estimated_value, 0),
          },
          ai_assistance: {
            success_probability: Array.from({ length: 3 }).map(() => ({
              _id: new Types.ObjectId(),
              item_id: new Types.ObjectId(),
              suggested_item_id: new Types.ObjectId(),
              probability: faker.number.float({ min: 0, max: 1 }),
              created_at: faker.date.recent(),
            })),
            auto_trade: {
              enabled: faker.datatype.boolean(),
              data: Array.from({ length: 2 }).map(() => ({
                _id: new Types.ObjectId(),
                item_id: new Types.ObjectId(),
                status: faker.helpers.arrayElement([
                  AutoTradeStatusEnum.Ongoing,
                  AutoTradeStatusEnum.Completed,
                  AutoTradeStatusEnum.UserPending,
                  AutoTradeStatusEnum.Aborted,
                ]),
                started_on: faker.date.recent(),
                finalized_on: faker.datatype.boolean() ? faker.date.recent() : undefined,
                chats: [new Types.ObjectId()],
              })),
            },
          },
          hired_brokers: hiredBrokers,
          chats_history: [new Types.ObjectId(), new Types.ObjectId()],
          barters: [new Types.ObjectId(), new Types.ObjectId()],
        };

        return barterer;
      }),
    );

    return this.bartererModel.insertMany(barterers.filter((barterer) => barterer !== null));
  }
}

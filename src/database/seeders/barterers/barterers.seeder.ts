import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Barterer, BartererDocument } from '../../schemas/barterers.schema';
import { User, UserDocument } from '../../schemas/users.schema';
import { Chat, ChatDocument } from '../../schemas/chats.schema';
import { Barter, BarterDocument } from '../../schemas/barters.schema';
import {
  AutoTradeStatusEnum,
  ItemConditionEnum,
} from '../../../utils/enums.utils';

@Injectable()
export class BarterersSeeder {
  constructor(
    @InjectModel(Barterer.name)
    private readonly bartererModel: Model<BartererDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    @InjectModel(Barter.name)
    private readonly barterModel: Model<BarterDocument>,
  ) {}

  getModel(): Model<BartererDocument> {
    return this.bartererModel;
  }

  async seedFirstCall(): Promise<BartererDocument[]> {
    const bartererUsers = await this.userModel.find({ user_type: 'barterer' });

    const brokers = await this.userModel.find({ user_type: 'broker' });
    if (!brokers || brokers.length === 0) {
      console.error('⚠️ No brokers found in the database.');
      return [];
    }

    const chats = await this.chatModel.find();
    const allWalletItems: {
      user_id: Types.ObjectId;
      item_id: Types.ObjectId;
    }[] = [];

    const barterers = await Promise.all(
      bartererUsers.map(async (user) => {
        const existingBarterer = await this.bartererModel.findOne({
          user_id: user._id,
        });

        if (existingBarterer) {
          return null;
        }

        const isPro = faker.datatype.boolean();

        const walletItems = Array.from({
          length: faker.number.int({ min: 1, max: 5 }),
        }).map(() => {
          const item_id = new Types.ObjectId();
          allWalletItems.push({ user_id: user._id as Types.ObjectId, item_id });
          return {
            item_id,
            name: faker.commerce.productName(),
            category: faker.commerce.department(),
            condition: faker.helpers.arrayElement([
              ItemConditionEnum.New,
              ItemConditionEnum.Refurbished,
              ItemConditionEnum.Used,
            ]),
            description: faker.commerce.productDescription(),
            estimated_value: faker.number.int({ min: 10, max: 1000 }),
            created_at: faker.date.past(),
            images: [faker.image.url()],
          };
        });

        const walletItemIds = walletItems.map((item) => item.item_id);

        const hiredBrokers = brokers.map((broker) => ({
          broker_id: broker._id as Types.ObjectId,
          hired_on: faker.date.past(),
          contract_termination_date: faker.date.future(),
          goal_to_barter: faker.commerce.productName(),
          starting_item_id: faker.helpers.arrayElement(walletItemIds),
          contract_budget: faker.number.int({ min: 100, max: 1000 }),
        }));

        const aiAssistance = {
          success_probability: Array.from({ length: 3 }).map(() => {
            const otherWalletItem = faker.helpers.arrayElement(
              allWalletItems.filter((item) =>
                (item.user_id as Types.ObjectId).equals(
                  user._id as Types.ObjectId,
                ),
              ),
            );
            return {
              _id: new Types.ObjectId(),
              item_id: otherWalletItem?.item_id || new Types.ObjectId(),
              suggested_item_id: faker.helpers.arrayElement(walletItemIds),
              probability: faker.number.float({ min: 0, max: 1 }),
              created_at: faker.date.recent(),
            };
          }),
          auto_trade: {
            enabled: faker.datatype.boolean(),
            data: Array.from({ length: 2 }).map(() => ({
              _id: new Types.ObjectId(),
              item_id: faker.helpers.arrayElement(walletItemIds),
              status: faker.helpers.arrayElement([
                AutoTradeStatusEnum.Ongoing,
                AutoTradeStatusEnum.Completed,
                AutoTradeStatusEnum.UserPending,
                AutoTradeStatusEnum.Aborted,
              ]),
              started_on: faker.date.recent(),
              finalized_on: faker.datatype.boolean()
                ? faker.date.recent()
                : undefined,
              chats: [new Types.ObjectId()],
            })),
          },
        };

        const userChats: Types.ObjectId[] = chats
          .filter((chat) =>
            chat.users_involved.some((id) =>
              (id as Types.ObjectId).equals(user._id as Types.ObjectId),
            ),
          )
          .map((chat) => chat._id as Types.ObjectId);

        return {
          user_id: user._id as Types.ObjectId,
          pro_status: {
            is_pro: isPro,
            activated_on: isPro ? faker.date.recent() : undefined,
            expires_on: isPro ? faker.date.future() : undefined,
            plan_id: new Types.ObjectId(),
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
            total_value: walletItems.reduce(
              (acc, item) => acc + item.estimated_value,
              0,
            ),
          },
          hired_brokers: hiredBrokers,
          ai_assistance: aiAssistance,
          chats_history: userChats,
          barters: [],
        };
      }),
    );

    const createdBarterers = await this.bartererModel.insertMany(
      barterers.filter((b) => b !== null) as BartererDocument[],
    );

    console.log(
      `✅ First call: Inserted ${createdBarterers.length} barterers.`,
    );
    return createdBarterers;
  }

  async seedSecondCall(): Promise<void> {
    const barterers = await this.bartererModel.find();
    const barters = await this.barterModel.find();

    for (const barterer of barterers) {
      const randomBarters = faker.helpers.arrayElements(
        barters.map((barter) => barter._id),
        faker.number.int({ min: 1, max: 5 }),
      );

      await this.bartererModel.updateOne(
        { _id: barterer._id },
        { $set: { barters: randomBarters } },
      );
    }

    console.log(`✅ Second call: Populated barters array for barterers.`);
  }

  async seed(firstCall: boolean = true): Promise<void> {
    if (firstCall) {
      console.log('🚀 Running first call of barterers seeder...');
      await this.seedFirstCall();
    } else {
      console.log('🚀 Running second call of barterers seeder...');
      await this.seedSecondCall();
    }
  }
}

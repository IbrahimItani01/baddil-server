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


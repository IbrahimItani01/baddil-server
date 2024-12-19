import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Chat, ChatDocument } from '../../schemas/chats.schema';
import { Broker, BrokerDocument } from '../../schemas/brokers.schema';
import { Barterer, BartererDocument } from '../../schemas/barterers.schema';
import { User, UserDocument } from '../../schemas/users.schema';
import { Message } from '../../subSchemas/chats.subSchema';
import { MessageStatusEnum } from '../../../utils/enums.utils';

@Injectable()
export class ChatsSeeder {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Broker.name)
    private readonly brokerModel: Model<BrokerDocument>,
    @InjectModel(Barterer.name)
    private readonly bartererModel: Model<BartererDocument>,
  ) {}

  getModel(): Model<ChatDocument> {
    return this.chatModel;
  }

  async seed(count: number = 20): Promise<ChatDocument[]> {
    const brokers = await this.brokerModel.find().populate('user_id');
    const barterers = await this.bartererModel.find().populate('user_id');

    const chats: ChatDocument[] = [];

    if (barterers.length < 2 || brokers.length === 0) {
      console.error('⚠️ Error seeding chats: Not enough users in database.');
      return [];
    }

    for (let i = 0; i < count / 3; i++) {
      const sender = faker.helpers.arrayElement(barterers);
      const receiver = faker.helpers.arrayElement(
        barterers.filter((b) => b._id !== sender._id),
      );

      const chatData = await this.createChat(sender.user_id, receiver.user_id);
      chats.push(chatData);
    }

    for (let i = 0; i < count / 3; i++) {
      const barterer = faker.helpers.arrayElement(barterers);
      if (barterer.hired_brokers?.length > 0) {
        const hiredBroker = faker.helpers.arrayElement(barterer.hired_brokers);
        const chatData = await this.createChat(
          barterer.user_id,
          hiredBroker.broker_id,
        );
        chats.push(chatData);
      }
    }

    for (let i = 0; i < count / 3; i++) {
      const broker = faker.helpers.arrayElement(brokers);
      if (broker.clients?.length > 0) {
        const client = faker.helpers.arrayElement(broker.clients);
        const chatData = await this.createChat(
          broker.user_id,
          client.client_id,
        );
        chats.push(chatData);
      }
    }

    try {
      const createdChats = await this.chatModel.insertMany(chats, {
        ordered: true,
      });
      console.log(`✅ ${count} chats seeded successfully!`);
      return createdChats;
    } catch (err) {
      console.error('⚠️ Error inserting chats:', err.message);
      return [];
    }
  }

  private async createChat(
    user1: Types.ObjectId,
    user2: Types.ObjectId,
  ): Promise<ChatDocument> {
    const messages: Message[] = [];

    const numberOfMessages = faker.number.int({ min: 3, max: 20 });

    for (let i = 0; i < numberOfMessages; i++) {
      const message: Message = {
        message_id: new Types.ObjectId(),
        sender: faker.helpers.arrayElement([user1, user2]),
        content: faker.lorem.sentence(),
        sent_date: faker.date.recent(),
        status: faker.helpers.arrayElement([
          MessageStatusEnum.Sent,
          MessageStatusEnum.Read,
        ]),
      };
      messages.push(message);
    }

    return {
      users_involved: [user1, user2],
      messages,
      handled_by_ai: faker.datatype.boolean(),
    } as unknown as ChatDocument;
  }
}

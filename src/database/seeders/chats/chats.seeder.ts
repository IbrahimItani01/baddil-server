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

  async seed(): Promise<ChatDocument[]> {
    const brokers = await this.brokerModel.find().populate('user_id');
    const barterers = await this.bartererModel.find().populate('user_id');
    const chats: ChatDocument[] = [];

    for (let i = 0; i < barterers.length - 1; i++) {
      const sender = barterers[i];
      const receiver = barterers[i + 1];

      const chatData =
        Math.random() > 0.5
          ? await this.createChat(sender.user_id, receiver.user_id, false)
          : await this.createChat(sender.user_id, receiver.user_id);

      chats.push(chatData);
    }

    for (const barterer of barterers) {
      for (const hiredBroker of barterer.hired_brokers) {
        const chatData = await this.createChat(
          barterer.user_id,
          hiredBroker.broker_id,
        );
        chats.push(chatData);
      }
    }

    for (const broker of brokers) {
      for (const client of broker.clients) {
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
      console.log('✅ Chat seeding completed successfully!');
      return createdChats;
    } catch (err) {
      console.error('⚠️ Error inserting chats:', err.message);
      return [];
    }
  }

  private async createChat(
    user1: Types.ObjectId,
    user2: Types.ObjectId,
    withMessages = true,
  ): Promise<ChatDocument> {
    const messages: Message[] = [];
    if (withMessages) {
      for (let i = 0; i < faker.number.int({ min: 3, max: 10 }); i++) {
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
    }

    return this.chatModel.create({
      users_involved: [user1, user2],
      messages,
      handled_by_ai: faker.datatype.boolean(),
    });
  }
}

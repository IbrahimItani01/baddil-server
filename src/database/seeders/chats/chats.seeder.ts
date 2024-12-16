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


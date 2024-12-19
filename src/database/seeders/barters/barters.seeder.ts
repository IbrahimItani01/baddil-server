import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { BarterStatusEnum, RatingEnum } from '../../../utils/enums.utils';
import { MeetupStatusEnum, ReviewSideEnum } from '../../../utils/enums.utils';
import { Barter, BarterDocument } from '../../schemas/barters.schema';
import { Broker, BrokerDocument } from '../../schemas/brokers.schema';
import { Barterer, BartererDocument } from '../../schemas/barterers.schema';

@Injectable()
export class BartersSeeder {
  constructor(
    @InjectModel(Barter.name)
    private readonly barterModel: Model<BarterDocument>,
    @InjectModel(Broker.name)
    private readonly brokerModel: Model<BrokerDocument>,
    @InjectModel(Barterer.name)
    private readonly bartererModel: Model<BartererDocument>,
  ) {}

  getModel(): Model<BarterDocument> {
    return this.barterModel;
  }

  async seed(count: number): Promise<void> {
    const brokers = await this.brokerModel.find().populate({
      path: 'clients.client_id',
    });

    const barterers = await this.bartererModel.find().populate('wallet.items');

    const promises = Array.from({ length: count }).map(async () => {
      const initiator = faker.helpers.arrayElement([...brokers, ...barterers]);
      let receiver: BrokerDocument | BartererDocument;

      while (true) {
        receiver = faker.helpers.arrayElement(
          [...brokers, ...barterers].filter(
            (user) => user._id.toString() !== initiator._id.toString(),
          ),
        );
        if (initiator && receiver) break;
      }

      let initiatorItems: Types.ObjectId[] = [];
      let receiverItems: Types.ObjectId[] = [];

      if (initiator instanceof Barterer) {
        initiatorItems = faker.helpers
          .arrayElements(initiator.wallet.items, 2)
          .map((item) => item.item_id);
      } else if (initiator instanceof Broker) {
        const client = faker.helpers.arrayElement(initiator.clients);
        if (
          client &&
          client.client_id instanceof Barterer &&
          client.client_id.wallet?.items
        ) {
          initiatorItems = faker.helpers
            .arrayElements(client.client_id.wallet.items, 2)
            .map((item) => item.item_id);
        }
      }

      if (receiver instanceof Barterer) {
        receiverItems = faker.helpers
          .arrayElements(receiver.wallet.items, 2)
          .map((item) => item.item_id);
      } else if (receiver instanceof Broker) {
        const client = faker.helpers.arrayElement(receiver.clients);
        if (
          client &&
          client.client_id instanceof Barterer &&
          client.client_id.wallet?.items
        ) {
          receiverItems = faker.helpers
            .arrayElements(client.client_id.wallet.items, 2)
            .map((item) => item.item_id);
        }
      }

      const fakeBarter = {
        status: faker.helpers.arrayElement(Object.values(BarterStatusEnum)),
        initiator_items: initiatorItems,
        receiver_items: receiverItems,
        completed_at: faker.datatype.boolean() ? faker.date.past() : null,

        rating: faker.helpers.arrayElement(Object.values(RatingEnum)),

        reviews: faker.datatype.boolean()
          ? [
              {
                side: faker.helpers.arrayElement(Object.values(ReviewSideEnum)),
                review_text: faker.lorem.sentence(),
              },
              {
                side: faker.helpers.arrayElement(Object.values(ReviewSideEnum)),
                review_text: faker.lorem.sentence(),
              },
            ]
          : [],

        meetup: faker.datatype.boolean()
          ? {
              meetup_id: new Types.ObjectId(),
              status: faker.helpers.arrayElement(
                Object.values(MeetupStatusEnum),
              ),
              location: faker.location.city(),
              qr_code: uuidv4(),
              date: faker.date.future(),
            }
          : null,

        users_involved: [initiator._id, receiver._id],
      };

      try {
        const barter = new this.barterModel(fakeBarter);
        await barter.save();
      } catch (error) {
        console.error('⚠️ Error creating barter:', error);
      }
    });

    await Promise.all(promises);
    console.log(`✅ ${count} barters have been seeded!`);
  }
}

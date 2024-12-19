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
    const promises = Array.from({ length: count }).map(async () => {
      const fakeBarter = {
        status: faker.helpers.arrayElement(Object.values(BarterStatusEnum)),
        initiator_items: [new Types.ObjectId(), new Types.ObjectId()],
        receiver_items: [new Types.ObjectId(), new Types.ObjectId()],
        completed_at: faker.datatype.boolean() ? faker.date.past() : null,

        rating: faker.datatype.boolean()
          ? faker.helpers.arrayElement(ratingValues)
          : null,

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
      };

      try {
        const barter = new this.barterModel(fakeBarter);
        await barter.save();
        console.log('✅ Barter created:', barter._id);
      } catch (error) {
        console.error('⚠️ Error creating barter:', error.message);
      }
    });

    await Promise.all(promises);
    console.log(`✅ ${count} barters have been seeded!`);
  }
}

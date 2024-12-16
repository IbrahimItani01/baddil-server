import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { BarterStatusEnum, RatingEnum } from '../../../utils/enums.utils';
import { MeetupStatusEnum, ReviewSideEnum } from '../../../utils/enums.utils';
import { v4 as uuidv4 } from 'uuid'; 
import { Barter, BarterDocument } from '../../schemas/barters.schema';

const ratingValues = Object.values(RatingEnum).filter(value => typeof value === 'number') as number[];

@Injectable()
export class BartersSeeder {
  constructor(
    @InjectModel(Barter.name)
    private readonly barterModel: Model<BarterDocument>,
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


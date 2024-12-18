import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BarterStatusEnum, RatingEnum } from '../../utils/enums.utils';
import {
  ReviewSchema,
  MeetupSchema,
  Meetup,
  Review,
} from '../subSchemas/barters.subSchema';

export type BarterDocument = Barter & Document;

@Schema({ timestamps: true })
export class Barter {
  @Prop({
    type: String,
    enum: Object.values(BarterStatusEnum),
    default: BarterStatusEnum.Ongoing,
    required: true,
  })
  status: BarterStatusEnum;

  @Prop({ type: [Types.ObjectId], ref: 'Item', required: true })
  initiator_items: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Item', required: true })
  receiver_items: Types.ObjectId[];

  @Prop({ type: Date, required: false })
  completed_at: Date;

  @Prop({
    type: String,
    enum: Object.values(RatingEnum),
    required: false,
  })
  rating: RatingEnum;

  @Prop({
    type: [ReviewSchema],
    required: false,
  })
  reviews: Review[];

  @Prop({
    type: MeetupSchema,
    required: false,
  })
  meetup: Meetup;

  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  users_involved: Types.ObjectId[];
}

export const BarterSchema = SchemaFactory.createForClass(Barter);

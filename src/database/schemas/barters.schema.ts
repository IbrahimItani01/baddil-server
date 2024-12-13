import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BarterStatus, Rating } from 'src/utils/enums.utils';
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
    enum: Object.values(BarterStatus),
    default: BarterStatus.Ongoing,
    required: true,
  })
  status: BarterStatus;

  @Prop({ type: [Types.ObjectId], ref: 'Item', required: true })
  initiator_items: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Item', required: true })
  receiver_items: Types.ObjectId[];

  @Prop({ type: Date, required: false })
  completed_at: Date;

  @Prop({
    type: Number,
    enum: Object.values(Rating),
    required: false,
  })
  rating: Rating;

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
}

export const BarterSchema = SchemaFactory.createForClass(Barter);

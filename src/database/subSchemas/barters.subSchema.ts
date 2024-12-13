import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ReviewSideEnum, MeetupStatusEnum } from 'src/utils/enums.utils'; // Correct usage of enums for sub-schemas

@Schema()
export class Review {
  @Prop({
    type: String,
    enum: Object.values(ReviewSideEnum),
    required: true,
  })
  side: ReviewSideEnum;

  @Prop({ type: String, required: true })
  review_text: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

@Schema()
export class Meetup {
  @Prop({ type: Types.ObjectId, ref: 'Meetup', required: true })
  meetup_id: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(MeetupStatusEnum),
    required: true,
  })
  status: MeetupStatusEnum;

  @Prop({ type: String, required: true })
  location: string;

  @Prop({ type: String, required: true })
  qr_code: string;

  @Prop({ type: Date, required: true })
  date: Date;
}

export const MeetupSchema = SchemaFactory.createForClass(Meetup);

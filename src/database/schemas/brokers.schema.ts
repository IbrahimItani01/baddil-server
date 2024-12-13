import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  Client,
  ClientSchema,
  Performance,
  PerformanceSchema,
  Rating,
  RatingSchema,
  VipStatus,
  VipStatusSchema,
} from '../subSchemas/brokers.subSchema';

export type BrokerDocument = Broker & Document;

@Schema({ timestamps: true })
export class Broker {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Number, required: true })
  rate_per_hour: number;

  @Prop({ type: VipStatusSchema, required: true })
  vip_status: VipStatus;

  @Prop({ type: PerformanceSchema, required: true })
  performance: Performance;

  @Prop({ type: [ClientSchema], required: false })
  clients: Client[];

  @Prop({ type: [RatingSchema], required: false })
  ratings: Rating[];

  @Prop({
    type: [Types.ObjectId],
    ref: 'Chat',
    default: [],
  })
  chats_history: Types.ObjectId[];
}

export const BrokerSchema = SchemaFactory.createForClass(Broker);

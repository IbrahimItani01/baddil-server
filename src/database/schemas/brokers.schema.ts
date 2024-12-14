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

  @Prop({ type: Number, required: false })
  rate_per_hour: number;

  @Prop({ type: VipStatusSchema, default: {} })
  vip_status: VipStatus;

  @Prop({ type: PerformanceSchema, default: {} })
  performance: Performance;

  @Prop({ type: [ClientSchema], default: [] })
  clients: Client[];

  @Prop({ type: [RatingSchema], default: [] })
  ratings: Rating[];

  @Prop({
    type: [Types.ObjectId],
    ref: 'Chat',
    default: [],
  })
  chats_history: Types.ObjectId[];
}

export const BrokerSchema = SchemaFactory.createForClass(Broker);

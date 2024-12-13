import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  AiAssistance,
  AiAssistanceSchema,
  HiredBroker,
  HiredBrokerSchema,
  ProStatus,
  ProStatusSchema,
  Tier,
  TierSchema,
  Wallet,
  WalletSchema,
} from '../subSchemas/barterers.subSchema';

export type BartererDocument = Barterer & Document;

@Schema({ timestamps: true })
export class Barterer {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user_id: Types.ObjectId;

  @Prop({
    type: ProStatusSchema,
    required: false,
  })
  pro_status: ProStatus;

  @Prop({
    type: TierSchema,
    required: false,
  })
  tier: Tier;

  @Prop({
    type: WalletSchema,
    required: false,
  })
  wallet: Wallet;

  @Prop({
    type: AiAssistanceSchema,
  })
  ai_assistance: AiAssistance;

  @Prop({
    type: [HiredBrokerSchema],
  })
  hired_brokers: HiredBroker[];

  @Prop({ type: [Types.ObjectId], ref: 'Chat', default: [] })
  chats_history: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Barter', default: [] })
  barters: Types.ObjectId[];
}

export const BartererSchema = SchemaFactory.createForClass(Barterer);
